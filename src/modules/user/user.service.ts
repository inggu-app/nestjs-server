import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from './user.model'
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types'
import { CreateUserDto } from './dto/createUser.dto'
import { ModelBase, MongoIdString, ObjectByInterface, ServiceGetOptions } from '../../global/types'
import { Error, Types } from 'mongoose'
import {
  FUNCTIONALITY_EXTRA_FIELDS,
  FUNCTIONALITY_INCORRECT_FIELD_TYPE,
  FUNCTIONALITY_MISSING_FIELDS,
  INCORRECT_CREDENTIALS,
  ROLE_EXTRA_FIELDS,
  ROLE_INCORRECT_FIELD_TYPE,
  ROLE_MISSING_FIELDS,
  USER_HAS_NO_ROLE_WITH_ID,
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
import { FunctionalityService } from '../functionality/functionality.service'
import { checkTypes } from '../../global/utils/checkTypes'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { TypesEnum } from '../../global/enums/types.enum'

export interface UserAccessTokenData {
  id: Types.ObjectId
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    @Inject(forwardRef(() => ViewService)) private readonly viewService: ViewService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly functionalityService: FunctionalityService
  ) {}

  async create(dto: CreateUserDto) {
    await this.checkExists(
      { login: dto.login },
      { error: new BadRequestException(USER_WITH_LOGIN_EXISTS(dto.login)), checkExisting: false }
    )

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

  async getById(id: Types.ObjectId | MongoIdString, options?: ServiceGetOptions<UserField>) {
    id = stringToObjectId(id)
    await this.checkExists({ _id: id })
    return this.userModel.findById(
      id,
      Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields,
      options?.queryOptions
    ) as unknown as DocumentType<UserModel>
  }

  async getByLogin(login: string, options?: ServiceGetOptions<UserField>) {
    await this.checkExists({ login }, { error: new HttpException(USER_WITH_LOGIN_NOT_FOUND(login), HttpStatus.NOT_FOUND) })
    return this.userModel.findOne(
      { login },
      Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields,
      options?.queryOptions
    ) as unknown as DocumentType<UserModel>
  }

  async getByRoleId(
    userId: Types.ObjectId | MongoIdString,
    roleId: Types.ObjectId | MongoIdString,
    options?: ServiceGetOptions<UserField>
  ) {
    await this.roleService.checkExists({ _id: roleId })
    const user = await this.getById(userId, {
      fields: Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields, ['roles']) : { ...options?.fields, roles: 1 },
      queryOptions: options?.queryOptions,
    })
    const neededRole = user.roles.find(role => role.role.toString() == roleId.toString())
    if (!neededRole) throw new BadRequestException(USER_HAS_NO_ROLE_WITH_ID(roleId))

    return neededRole.data
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
          if (!checkTypes(roleData.data[field], role.roleFields[field])) throw new BadRequestException(ROLE_INCORRECT_FIELD_TYPE(field))
        })
      }
    }

    if (dto.views) {
      for await (const viewId of dto.views) await this.viewService.checkExists({ _id: viewId })
    }

    if (dto.available) {
      for (const f of dto.available) {
        const functionality = this.functionalityService.getByCode(f.code)
        const extraFields = difference(objectKeys(f.data), objectKeys(functionality.default))
        if (extraFields.length) throw new BadRequestException(FUNCTIONALITY_EXTRA_FIELDS(f.code, extraFields))
        const missingFields = difference(objectKeys(functionality.default), objectKeys(f.data))
        if (missingFields.length) throw new BadRequestException(FUNCTIONALITY_MISSING_FIELDS(f.code, missingFields))
        objectKeys(f.data).forEach(field => {
          if (
            functionality.default[field] === FunctionalityAvailableTypeEnum.ALL ||
            functionality.default[field] === FunctionalityAvailableTypeEnum.CUSTOM
          ) {
            if (f.data[field] !== FunctionalityAvailableTypeEnum.ALL && f.data[field] !== FunctionalityAvailableTypeEnum.CUSTOM)
              throw new BadRequestException(FUNCTIONALITY_INCORRECT_FIELD_TYPE(field))
          } else if (!checkTypes(f.data[field], functionality.default[field] as TypesEnum)) {
            throw new BadRequestException(FUNCTIONALITY_INCORRECT_FIELD_TYPE(field))
          }
        })
      }
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
    options: { error?: ((filter: ObjectByInterface<typeof UserFieldsEnum, ModelBase>) => Error) | Error; checkExisting?: boolean } = {
      error: f => new NotFoundException(USER_WITH_ID_NOT_FOUND(f._id)),
      checkExisting: true,
    }
  ) {
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.userModel.exists(f)

        if (!candidate && options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        } else if (candidate && !options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        }
      }
    } else {
      const candidate = await this.userModel.exists(filter)

      if (!candidate && options.checkExisting) {
        if (typeof options.error === 'function') throw options.error(filter)
        throw options.error
      } else if (candidate && !options.checkExisting) {
        if (typeof options.error === 'function') throw options.error(filter)
        throw options.error
      }
    }

    return true
  }
}
