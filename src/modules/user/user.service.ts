import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from './user.model'
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types'
import { CreateUserDto } from './dto/createUser.dto'
import { ModelBase, MongoIdString, ObjectByInterface } from '../../global/types'
import { Error, QueryOptions, Types } from 'mongoose'
import {
  INCORRECT_CREDENTIALS,
  USER_WITH_ID_NOT_FOUND,
  USER_WITH_LOGIN_EXISTS,
  USER_WITH_LOGIN_NOT_FOUND,
} from '../../global/constants/errors.constants'
import { UserField, UserFieldsEnum } from './user.constants'
import generatePassword from '../../global/utils/generatePassword'
import generateUniqueKey from '../../global/utils/generateUniqueKey'
import { hashSalt } from '../../global/constants/other.constants'
import { UpdateUserDto } from './dto/updateUser.dto'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { stringToObjectId } from '../../global/utils/stringToObjectId'
import { LoginUserDto } from './dto/loginUser.dto'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

export interface UserAccessTokenData {
  id: Types.ObjectId
}

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>, private readonly jwtService: JwtService) {}

  async create(dto: CreateUserDto) {
    await this.checkExists({ login: dto.login }, new BadRequestException(USER_WITH_LOGIN_EXISTS(dto.login)), false)

    const generatedUniqueKey = generateUniqueKey()
    const hashedUniqueKey = await bcrypt.hash(generatedUniqueKey, hashSalt)
    const generatedPassword = generatePassword()
    const hashedPassword = await bcrypt.hash(generatedPassword, hashSalt)

    await this.userModel.create({ ...dto, hashedUniqueKey, hashedPassword })

    return {
      uniqueKey: generatedUniqueKey,
      password: generatedPassword,
    }
  }

  async getById(id: Types.ObjectId | MongoIdString, options?: { fields?: UserField[]; queryOptions?: QueryOptions }) {
    id = stringToObjectId(id)
    await this.checkExists({ _id: id })
    return (await this.userModel
      .findById(id, fieldsArrayToProjection(options?.fields), options?.queryOptions)
      .exec()) as DocumentType<UserModel>
  }

  async getByLogin(login: string, options?: { fields?: UserField[]; queryOptions?: QueryOptions }) {
    await this.checkExists({ login }, new HttpException(USER_WITH_LOGIN_NOT_FOUND(login), HttpStatus.NOT_FOUND))
    return (await this.userModel
      .findOne({ login }, fieldsArrayToProjection(options?.fields), options?.queryOptions)
      .exec()) as DocumentType<UserModel>
  }

  async update(dto: UpdateUserDto) {
    await this.checkExists({ _id: dto.id })

    await this.userModel.updateOne({ _id: dto.id }, dto)
  }

  async delete(userId: Types.ObjectId) {
    await this.checkExists({ _id: userId })

    await this.userModel.deleteOne({ _id: userId })
  }

  async login(dto: LoginUserDto) {
    const user = await this.getByLogin(dto.login)

    if (await bcrypt.compare(dto.password, user.hashedPassword)) {
      return {
        token: this.jwtService.sign({ id: user.id }) as unknown as UserAccessTokenData,
      }
    } else {
      throw new HttpException(INCORRECT_CREDENTIALS, HttpStatus.BAD_REQUEST)
    }
  }

  async checkExists(
    filter: ObjectByInterface<typeof UserFieldsEnum, ModelBase> | ObjectByInterface<typeof UserFieldsEnum, ModelBase>[],
    error: ((filter: ObjectByInterface<typeof UserFieldsEnum, ModelBase>) => Error) | Error = f =>
      new NotFoundException(USER_WITH_ID_NOT_FOUND(f._id)),
    checkExisting = true
  ) {
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.userModel.exists(f)

        if (!candidate && checkExisting) {
          if (error instanceof Error) throw Error
          throw error(f)
        } else if (candidate && !checkExisting) {
          if (error instanceof Error) throw Error
          throw error(f)
        }
      }
    } else {
      const candidate = await this.userModel.exists(filter)
      if (!candidate && checkExisting) {
        if (error instanceof Error) throw error
        throw error(filter)
      } else if (candidate && !checkExisting) {
        if (error instanceof Error) throw error
        throw error(filter)
      }
    }

    return true
  }
}
