import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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
import { INCORRECT_CREDENTIALS } from '../../global/constants/errors.constants'
import { JwtType, RESPONSIBLE_ACCESS_TOKEN_DATA } from '../../global/utils/checkJwtType'
import { GroupService } from '../group/group.service'
import { GROUP_NOT_FOUND } from '../group/group.constants'

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
    private readonly groupService: GroupService
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

  async deleteGroupFromAllResponsibles(id: Types.ObjectId) {
    await this.responsibleModel.updateMany({ groups: { $in: [id] } }, { $pull: { groups: id } })
  }

  async update(dto: UpdateResponsibleDto) {
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

  getAll() {
    return this.responsibleModel.find({}, { hashedUniqueKey: 0, hashedPassword: 0 })
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
