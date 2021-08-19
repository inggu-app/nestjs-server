import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import * as bcrypt from 'bcrypt'
import { ResponsibleModel } from './responsible.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateResponsibleDto } from './dto/createResponsible.dto'
import { RESPONSIBLE_EXISTS, RESPONSIBLE_NOT_FOUND } from './responsible.constants'
import generateUniqueKey from '../../global/utils/generateUniqueKey'
import { hashSalt } from '../../global/constants/other.constants'
import generatePassword from '../../global/utils/generatePassword'
import { Types } from 'mongoose'
import { LoginResponsibleDto } from './dto/loginResponsible.dto'
import { JwtService } from '@nestjs/jwt'
import { UpdateResponsibleDto } from './dto/updateResponsible.dto'
import {
  INCORRECT_CREDENTIALS,
  INCORRECT_PAGE_COUNT_QUERIES,
} from '../../global/constants/errors.constants'
import { JwtType, RESPONSIBLE_ACCESS_TOKEN_DATA } from '../../global/utils/checkJwtType'
import { GroupService } from '../group/group.service'
import { GROUP_NOT_FOUND, GROUP_WITH_ID_NOT_FOUND } from '../group/group.constants'

export interface ResponsibleAccessTokenData extends JwtType<typeof RESPONSIBLE_ACCESS_TOKEN_DATA> {
  tokenType: typeof RESPONSIBLE_ACCESS_TOKEN_DATA
  login: string
  name: string
  groups: Types.ObjectId[]
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
    const candidate = await this.responsibleModel.findOne({ login: dto.login })

    if (candidate) {
      throw new HttpException(RESPONSIBLE_EXISTS, HttpStatus.CONFLICT)
    }

    const generatedUniqueKey = generateUniqueKey()
    const hashedUniqueKey = await bcrypt.hash(generatedUniqueKey, hashSalt)
    const generatedPassword = generatePassword()
    const hashedPassword = await bcrypt.hash(generatedPassword, hashSalt)

    const responsible = await this.responsibleModel.create({
      groups: dto.groups,
      login: dto.login,
      name: dto.name,
      hashedUniqueKey,
      hashedPassword,
    })

    return {
      id: responsible.id,
      groups: dto.groups,
      login: dto.login,
      name: dto.name,
      uniqueKey: generatedUniqueKey,
      password: generatedPassword,
    }
  }

  async delete(id: Types.ObjectId) {
    const candidate = await this.responsibleModel.findByIdAndDelete(id, {
      projection: { hashedUniqueKey: 0, hashedPassword: 0 },
    })

    if (!candidate) {
      throw new HttpException(RESPONSIBLE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async deleteGroupsFromAllResponsibles(ids: Types.ObjectId[]) {
    await this.responsibleModel.updateMany(
      { groups: { $in: ids } },
      { $pull: { groups: { $in: ids } } }
    )
  }

  async update(dto: UpdateResponsibleDto) {
    const loginCandidate = await this.responsibleModel.findOne({ login: dto.login })

    if (loginCandidate && loginCandidate?.id !== dto.id) {
      throw new HttpException(RESPONSIBLE_EXISTS, HttpStatus.BAD_REQUEST)
    }

    for await (const groupId of dto.groups) {
      const groupCandidate = await this.groupService.getById(groupId)

      if (!groupCandidate) {
        throw new HttpException(GROUP_WITH_ID_NOT_FOUND(groupId), HttpStatus.NOT_FOUND)
      }
    }

    const candidate = await this.responsibleModel.findByIdAndUpdate(
      dto.id,
      {
        $set: {
          groups: dto.groups,
          login: dto.login,
          name: dto.name,
        },
      },
      { projection: { hashedPassword: 0, hashedUniqueKey: 0 } }
    )

    if (!candidate) {
      throw new HttpException(RESPONSIBLE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async resetPassword(id: Types.ObjectId) {
    const generatedPassword = generatePassword()
    const hashedPassword = await bcrypt.hash(generatedPassword, hashSalt)

    const candidate = await this.responsibleModel.findByIdAndUpdate(id, {
      $set: {
        hashedPassword,
      },
    })

    if (!candidate) {
      throw new HttpException(RESPONSIBLE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return {
      password: generatedPassword,
    }
  }

  async getById(id: Types.ObjectId) {
    const candidate = await this.responsibleModel.findById(id, {
      hashedUniqueKey: 0,
      hashedPassword: 0,
    })

    if (!candidate) {
      throw new HttpException(RESPONSIBLE_NOT_FOUND, HttpStatus.BAD_REQUEST)
    }

    return candidate
  }

  getAll(page: number, count: number, name: string) {
    if (page === -1 && count === -1) {
      return this.responsibleModel.find(
        { name: { $regex: name, $options: 'i' } },
        { hashedUniqueKey: 0, hashedPassword: 0 }
      )
    } else if (page === -1 || count === -1) {
      throw new HttpException(INCORRECT_PAGE_COUNT_QUERIES, HttpStatus.BAD_REQUEST)
    } else {
      return this.responsibleModel
        .find({ name: { $regex: name, $options: 'i' } }, { hashedUniqueKey: 0, hashedPassword: 0 })
        .skip((page - 1) * count)
        .limit(count)
    }
  }

  countAll(name: string) {
    return this.responsibleModel.countDocuments({ name: { $regex: name, $options: 'i' } })
  }

  async getAllByGroup(id: Types.ObjectId) {
    const candidate = await this.groupService.getById(id)

    if (!candidate) {
      throw new HttpException(GROUP_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.responsibleModel.find(
      { groups: { $in: [id] } },
      { hashedPassword: 0, hashedUniqueKey: 0 }
    )
  }

  async getAllGroupsByResponsible(id: Types.ObjectId) {
    const candidate = await this.responsibleModel.findById(id).populate('groups')

    if (!candidate) {
      throw new HttpException(RESPONSIBLE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return candidate.groups
  }

  async login(dto: LoginResponsibleDto) {
    const generatedUniqueKey = generateUniqueKey()
    const hashedUniqueKey = await bcrypt.hash(generatedUniqueKey, hashSalt)
    const candidate = await this.responsibleModel.findOneAndUpdate(
      { login: dto.login },
      { $set: { hashedUniqueKey } }
    )

    if (!candidate) {
      throw new HttpException(INCORRECT_CREDENTIALS, HttpStatus.BAD_REQUEST)
    }

    const isRightPassword = await bcrypt.compare(dto.password, candidate.hashedPassword)

    if (!isRightPassword) {
      throw new HttpException(INCORRECT_CREDENTIALS, HttpStatus.UNAUTHORIZED)
    } else {
      const accessTokenData: ResponsibleAccessTokenData = {
        tokenType: RESPONSIBLE_ACCESS_TOKEN_DATA,
        login: candidate.login,
        name: candidate.name,
        groups: candidate.groups,
        uniqueKey: generatedUniqueKey,
      }
      return {
        accessToken: this.jwtService.sign(accessTokenData),
      }
    }
  }
}
