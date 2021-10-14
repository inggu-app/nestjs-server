import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import * as bcrypt from 'bcrypt'
import { ResponsibleModel } from './responsible.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateResponsibleDto } from './dto/createResponsible.dto'
import { ResponsibleField, ResponsibleFieldsEnum } from './responsible.constants'
import generateUniqueKey from '../../global/utils/generateUniqueKey'
import { hashSalt } from '../../global/constants/other.constants'
import generatePassword from '../../global/utils/generatePassword'
import { Error, Types } from 'mongoose'
import { LoginResponsibleDto } from './dto/loginResponsible.dto'
import { JwtService } from '@nestjs/jwt'
import { UpdateResponsibleDto } from './dto/updateResponsible.dto'
import {
  INCORRECT_CREDENTIALS,
  RESPONSIBLE_WITH_ID_NOT_FOUND,
  RESPONSIBLE_WITH_LOGIN_EXISTS,
} from '../../global/constants/errors.constants'
import { JwtType, RESPONSIBLE_ACCESS_TOKEN_DATA } from '../../global/utils/checkJwtType'
import { GroupService } from '../group/group.service'
import { GroupField } from '../group/group.constants'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { ModelBase, ObjectByInterface } from '../../global/types'

export interface ResponsibleAccessTokenData extends JwtType<typeof RESPONSIBLE_ACCESS_TOKEN_DATA> {
  tokenType: typeof RESPONSIBLE_ACCESS_TOKEN_DATA
  id: Types.ObjectId
  login: string
  name: string
  uniqueKey: string
}

@Injectable()
export class ResponsibleService {
  constructor(
    @InjectModel(ResponsibleModel) private readonly responsibleModel: ModelType<ResponsibleModel>,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => GroupService)) private readonly groupService: GroupService
  ) {}

  async create(dto: CreateResponsibleDto) {
    await this.checkExists({ login: dto.login }, new HttpException(RESPONSIBLE_WITH_LOGIN_EXISTS(dto.login), HttpStatus.CONFLICT))

    const generatedUniqueKey = generateUniqueKey()
    const hashedUniqueKey = await bcrypt.hash(generatedUniqueKey, hashSalt)
    const generatedPassword = generatePassword()
    const hashedPassword = await bcrypt.hash(generatedPassword, hashSalt)

    return this.responsibleModel.create({
      groups: dto.groups,
      faculties: dto.faculties,
      forbiddenGroups: dto.forbiddenGroups,
      login: dto.login,
      name: dto.name,
      hashedUniqueKey,
      hashedPassword,
    })
  }

  async delete(id: Types.ObjectId) {
    await this.checkExists({ _id: id })
    await this.responsibleModel.deleteOne({ _id: id }).exec()

    return
  }

  async deleteGroupsFromAllResponsibles(ids: Types.ObjectId[]) {
    await this.responsibleModel.updateMany({ groups: { $in: ids } }, { $pull: { groups: { $in: ids } } }).exec()
  }

  async update(dto: UpdateResponsibleDto) {
    await this.checkExists({ _id: dto.id })
    await this.checkExists({ login: dto.login }, new HttpException(RESPONSIBLE_WITH_LOGIN_EXISTS(dto.login), HttpStatus.BAD_REQUEST))
    for await (const groupId of dto.groups) await this.groupService.checkExists({ _id: groupId })

    await this.responsibleModel
      .updateOne(
        { _id: dto.id },
        {
          $set: {
            groups: dto.groups,
            faculties: dto.faculties,
            forbiddenGroups: dto.forbiddenGroups,
            login: dto.login,
            name: dto.name,
          },
        }
      )
      .exec()

    return this.responsibleModel.findById(dto.id, { hashedPassword: 0, hashedUniqueKey: 0 }).exec()
  }

  async resetPassword(id: Types.ObjectId) {
    await this.checkExists({ _id: id })

    const generatedPassword = generatePassword()
    const hashedPassword = await bcrypt.hash(generatedPassword, hashSalt)

    await this.responsibleModel
      .updateOne(
        { _id: id },
        {
          $set: {
            hashedPassword,
          },
        }
      )
      .exec()

    return {
      password: generatedPassword,
    }
  }

  async getById(id: Types.ObjectId, fields?: ResponsibleField[]) {
    const candidate = await this.responsibleModel.findById(id, fieldsArrayToProjection(fields)).exec()

    if (!candidate) {
      throw new HttpException(RESPONSIBLE_WITH_ID_NOT_FOUND(id), HttpStatus.BAD_REQUEST)
    }

    return candidate
  }

  getAll(page: number, count: number, name?: string, fields?: ResponsibleField[]) {
    return this.responsibleModel
      .find(name ? { name: { $regex: name, $options: 'i' } } : {}, fieldsArrayToProjection(fields))
      .skip((page - 1) * count)
      .limit(count)
      .exec()
  }

  async getAllByGroup(groupId: Types.ObjectId, page?: number, count?: number, fields?: ResponsibleField[]) {
    await this.groupService.checkExists({ _id: groupId })

    const responsibles = this.responsibleModel.find({ groups: { $in: [groupId] } }, fieldsArrayToProjection(fields))

    return responsibles
  }

  countByName(name?: string) {
    return this.responsibleModel.countDocuments(name ? { name: { $regex: name, $options: 'i' } } : {}).exec()
  }

  countByGroup(id: Types.ObjectId) {
    return this.responsibleModel.countDocuments({ groups: { $in: [id] } }).exec()
  }

  async getAllGroupsByResponsible(id: Types.ObjectId, fields?: GroupField[]) {
    const candidate = await this.responsibleModel
      .findById(id)
      .populate({ path: 'groups', select: fieldsArrayToProjection(fields) })
      .exec()

    if (!candidate) {
      throw new HttpException(RESPONSIBLE_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return candidate.groups
  }

  async login(dto: LoginResponsibleDto) {
    const generatedUniqueKey = generateUniqueKey()
    const hashedUniqueKey = await bcrypt.hash(generatedUniqueKey, hashSalt)
    const candidate = await this.responsibleModel.findOneAndUpdate({ login: dto.login }, { $set: { hashedUniqueKey } }).exec()

    if (!candidate) {
      throw new HttpException(INCORRECT_CREDENTIALS, HttpStatus.BAD_REQUEST)
    }

    const isRightPassword = await bcrypt.compare(dto.password, candidate.hashedPassword)

    if (!isRightPassword) {
      throw new HttpException(INCORRECT_CREDENTIALS, HttpStatus.UNAUTHORIZED)
    } else {
      const accessTokenData: ResponsibleAccessTokenData = {
        tokenType: RESPONSIBLE_ACCESS_TOKEN_DATA,
        id: candidate.id,
        login: candidate.login,
        name: candidate.name,
        uniqueKey: generatedUniqueKey,
      }
      return {
        accessToken: this.jwtService.sign(accessTokenData),
      }
    }
  }

  async checkExists(
    filter: ObjectByInterface<typeof ResponsibleFieldsEnum, ModelBase> | ObjectByInterface<typeof ResponsibleFieldsEnum, ModelBase>[],
    error: ((filter: ObjectByInterface<typeof ResponsibleFieldsEnum, ModelBase>) => Error) | Error = f =>
      new NotFoundException(RESPONSIBLE_WITH_ID_NOT_FOUND(f._id))
  ) {
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.responsibleModel.exists(f)

        if (!candidate) {
          if (error instanceof Error) throw Error
          throw error(f)
        }
      }
    } else {
      if (!(await this.responsibleModel.exists(filter))) {
        if (error instanceof Error) throw error
        throw error(filter)
      }
    }

    return true
  }
}
