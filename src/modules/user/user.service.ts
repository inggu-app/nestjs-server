import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from './user.model'
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types'
import { CreateUserDto } from './dto/createUser.dto'
import { ModelBase, MongoIdString, ObjectByInterface } from '../../global/types'
import { Error, QueryOptions, Types } from 'mongoose'
import {
  INCORRECT_CREDENTIALS,
  ROLE_EXTRA_FIELDS,
  ROLE_INCORRECT_FIELD_TYPE,
  ROLE_MISSING_FIELDS,
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
import { RoleService } from '../role/role.service'
import { objectKeys } from '../../global/utils/objectKeys'
import { difference } from 'underscore'
import { InterfaceModel } from '../interface/interface.model'
import { ViewService } from '../view/view.service'

export interface UserAccessTokenData {
  id: Types.ObjectId
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly viewService: ViewService
  ) {}

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
    return this.userModel.findById(
      id,
      fieldsArrayToProjection(options?.fields),
      options?.queryOptions
    ) as unknown as DocumentType<UserModel>
  }

  async getByLogin(login: string, options?: { fields?: UserField[]; queryOptions?: QueryOptions }) {
    await this.checkExists({ login }, new HttpException(USER_WITH_LOGIN_NOT_FOUND(login), HttpStatus.NOT_FOUND))
    return this.userModel.findOne(
      { login },
      fieldsArrayToProjection(options?.fields),
      options?.queryOptions
    ) as unknown as DocumentType<UserModel>
  }

  async update(dto: UpdateUserDto) {
    await this.checkExists({ _id: dto.id })

    if (dto.roles) {
      for await (const roleData of dto.roles) {
        const role = await this.roleService.getById(roleData.role)
        const extraFields = difference(objectKeys(roleData.data), objectKeys(role.roleFields))
        if (extraFields.length) throw new BadRequestException(ROLE_EXTRA_FIELDS(extraFields))
        const missingFields = difference(objectKeys(role.roleFields), objectKeys(roleData.data))
        if (missingFields.length) throw new BadRequestException(ROLE_MISSING_FIELDS(missingFields))
        objectKeys(roleData.data).forEach(field => {
          if (Array.isArray(role.roleFields[field])) {
            if (!Array.isArray(roleData.data[field])) throw new HttpException(ROLE_INCORRECT_FIELD_TYPE(field), HttpStatus.BAD_REQUEST)
          } else if (typeof roleData.data[field] !== typeof role.roleFields[field])
            throw new HttpException(ROLE_INCORRECT_FIELD_TYPE(field), HttpStatus.BAD_REQUEST)
        })
      }
    }

    if (dto.views) {
      for await (const viewId of dto.views) await this.viewService.checkExists({ _id: viewId })
    }

    await this.userModel.updateOne({ _id: dto.id }, dto)
  }

  async delete(userId: Types.ObjectId) {
    await this.checkExists({ _id: userId })

    await this.userModel.deleteOne({ _id: userId })
  }

  async login(dto: LoginUserDto) {
    const user = await this.getByLogin(dto.login, { queryOptions: { populate: 'interfaces' } })

    if (
      !user.interfaces.find(intrfc => {
        intrfc = intrfc as InterfaceModel
        return intrfc.code === dto.interfaceCode
      })
    )
      throw new ForbiddenException()

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
          if (typeof error === 'function') throw error(f)
          throw error
        } else if (candidate && !checkExisting) {
          if (typeof error === 'function') throw error(f)
          throw error
        }
      }
    } else {
      const candidate = await this.userModel.exists(filter)
      if (!candidate && checkExisting) {
        if (typeof error === 'function') throw error(filter)
        throw error
      } else if (candidate && !checkExisting) {
        if (typeof error === 'function') throw error(filter)
        throw error
      }
    }

    return true
  }
}
