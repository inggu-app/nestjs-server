import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import * as bcrypt from 'bcrypt'
import { ResponsibleModel } from './responsible.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateResponsibleDto } from './dto/createResponsible.dto'
import { ResponsibleField, ResponsibleFieldsEnum } from './responsible.constants'
import generateUniqueKey from '../../global/utils/generateUniqueKey'
import { hashSalt } from '../../global/constants/other.constants'
import generatePassword from '../../global/utils/generatePassword'
import { Types } from 'mongoose'
import { LoginResponsibleDto } from './dto/loginResponsible.dto'
import { JwtService } from '@nestjs/jwt'
import { UpdateResponsibleDto } from './dto/updateResponsible.dto'
import {
  GROUP_WITH_ID_NOT_FOUND,
  INCORRECT_CREDENTIALS,
  RESPONSIBLE_WITH_ID_NOT_FOUND,
  RESPONSIBLE_WITH_LOGIN_EXISTS,
} from '../../global/constants/errors.constants'
import { JwtType, RESPONSIBLE_ACCESS_TOKEN_DATA } from '../../global/utils/checkJwtType'
import { GroupService } from '../group/group.service'
import { GroupField } from '../group/group.constants'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import checkPageCount from '../../global/utils/checkPageCount'
import { isMongoId } from 'class-validator'
import { ObjectByInterface } from '../../global/types'

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
    const candidate = await this.responsibleModel.findOne({ login: dto.login }).exec()

    if (candidate) {
      throw new HttpException(RESPONSIBLE_WITH_LOGIN_EXISTS(dto.login), HttpStatus.CONFLICT)
    }

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
    const candidate = await this.responsibleModel
      .findByIdAndDelete(id, {
        projection: { hashedUniqueKey: 0, hashedPassword: 0 },
      })
      .exec()

    if (!candidate) {
      throw new HttpException(RESPONSIBLE_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async deleteGroupsFromAllResponsibles(ids: Types.ObjectId[]) {
    await this.responsibleModel
      .updateMany({ groups: { $in: ids } }, { $pull: { groups: { $in: ids } } })
      .exec()
  }

  async update(dto: UpdateResponsibleDto) {
    await this.checkExists(dto.id)

    const loginCandidateByLogin = await this.responsibleModel.findOne({ login: dto.login }).exec()

    if (loginCandidateByLogin && loginCandidateByLogin?.id !== dto.id) {
      throw new HttpException(RESPONSIBLE_WITH_LOGIN_EXISTS(dto.login), HttpStatus.BAD_REQUEST)
    }

    for await (const groupId of dto.groups) {
      const groupCandidate = await this.groupService.getById(groupId)

      if (!groupCandidate) {
        throw new HttpException(GROUP_WITH_ID_NOT_FOUND(groupId), HttpStatus.NOT_FOUND)
      }
    }

    const candidate = await this.responsibleModel
      .findByIdAndUpdate(
        dto.id,
        {
          $set: {
            groups: dto.groups,
            faculties: dto.faculties,
            forbiddenGroups: dto.forbiddenGroups,
            login: dto.login,
            name: dto.name,
          },
        },
        { projection: { hashedPassword: 0, hashedUniqueKey: 0 } }
      )
      .exec()

    if (!candidate) {
      throw new HttpException(RESPONSIBLE_WITH_ID_NOT_FOUND(dto.id), HttpStatus.NOT_FOUND)
    }

    return this.responsibleModel.findById(dto.id, { hashedPassword: 0, hashedUniqueKey: 0 }).exec()
  }

  async resetPassword(id: Types.ObjectId) {
    const generatedPassword = generatePassword()
    const hashedPassword = await bcrypt.hash(generatedPassword, hashSalt)

    const candidate = await this.responsibleModel
      .findByIdAndUpdate(id, {
        $set: {
          hashedPassword,
        },
      })
      .exec()

    if (!candidate) {
      throw new HttpException(RESPONSIBLE_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return {
      password: generatedPassword,
    }
  }

  async getById(id: Types.ObjectId, fields?: ResponsibleField[]) {
    const candidate = await this.responsibleModel
      .findById(id, fieldsArrayToProjection(fields))
      .exec()

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

  async getAllByGroup(
    groupId: Types.ObjectId,
    page?: number,
    count?: number,
    fields?: ResponsibleField[]
  ) {
    const checkedPageCount = checkPageCount(page, count)
    const candidate = await this.groupService.getById(groupId)

    if (!candidate) {
      throw new HttpException(GROUP_WITH_ID_NOT_FOUND(groupId), HttpStatus.NOT_FOUND)
    }

    const responsibles = this.responsibleModel.find(
      { groups: { $in: [groupId] } },
      fieldsArrayToProjection(fields)
    )

    if (checkedPageCount.page !== undefined) {
      return responsibles
        .skip((checkedPageCount.page - 1) * checkedPageCount.count)
        .limit(checkedPageCount.count)
    }

    return responsibles
  }

  countByName(name?: string) {
    return this.responsibleModel
      .countDocuments(name ? { name: { $regex: name, $options: 'i' } } : {})
      .exec()
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
    const candidate = await this.responsibleModel
      .findOneAndUpdate({ login: dto.login }, { $set: { hashedUniqueKey } })
      .exec()

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
    ids: Types.ObjectId | Types.ObjectId[],
    filter?: ObjectByInterface<typeof ResponsibleFieldsEnum>
  ) {
    if (isMongoId(ids)) {
      ids = ids as Types.ObjectId
      const candidate = await this.responsibleModel.exists(filter || { _id: ids })
      if (!candidate) {
        throw new HttpException(RESPONSIBLE_WITH_ID_NOT_FOUND(ids), HttpStatus.NOT_FOUND)
      }
    } else {
      ids = ids as Types.ObjectId[]
      for await (const id of ids) {
        const candidate = await this.responsibleModel.exists(filter || { _id: id })

        if (!candidate) {
          throw new HttpException(RESPONSIBLE_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
        }
      }
    }
  }
}
