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
import { Error, FilterQuery, Types } from 'mongoose'
import {
  FUNCTIONALITY_EXTRA_FIELDS,
  FUNCTIONALITY_INCORRECT_FIELD_TYPE,
  FUNCTIONALITY_INCORRECT_FIELD_VALUE,
  FUNCTIONALITY_MISSING_FIELDS,
  INCORRECT_CREDENTIALS,
  ROLE_EXTRA_FIELDS,
  ROLE_INCORRECT_FIELD_TYPE,
  ROLE_INCORRECT_FIELD_VALUE,
  ROLE_MISSING_FIELDS,
  USER_HAS_NO_ROLE_WITH_ID,
  USER_WITH_ID_NOT_FOUND,
  USER_WITH_LOGIN_EXISTS,
  USER_WITH_LOGIN_NOT_FOUND,
} from '../../global/constants/errors.constants'
import { UserField, UserFieldsEnum, UserGetManyDataForFunctionality } from './user.constants'
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
import { getModelWithString } from '@typegoose/typegoose'

export interface UserAccessTokenData {
  id: Types.ObjectId
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    @Inject(forwardRef(() => ViewService)) private readonly viewService: ViewService,
    @Inject(forwardRef(() => RoleService)) private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
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

    const result: any = {}
    neededRole.data.forEach(item => {
      result[item.key] = item.value
    })
    return result
  }

  getMany(page: number, count: number, name?: string, options?: ServiceGetOptions<UserField, UserGetManyDataForFunctionality>) {
    const filter: FilterQuery<DocumentType<UserModel>> = {}
    if (name) filter.name = { $regex: name, $options: 'i' }
    if (options?.functionality) {
      filter._id = { $nin: options.functionality.data.forbiddenUsers }
      filter['roles.role'] = { $nin: options.functionality.data.forbiddenRoles }
      if (options.functionality.data.availableUsersType === FunctionalityAvailableTypeEnum.CUSTOM)
        filter._id = { $in: options.functionality.data.availableUsers, $nin: options.functionality.data.forbiddenRoles }
      if (options.functionality.data.availableRolesType === FunctionalityAvailableTypeEnum.CUSTOM)
        filter['roles.role'] = { $in: options.functionality.data.availableRoles, $nin: options.functionality.data.forbiddenRoles }
    }

    return this.userModel
      .find(filter, Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields, options?.queryOptions)
      .map(doc => doc.map(item => item.toObject()))
      .skip((page - 1) * count)
      .limit(count)
  }

  countAll(name?: string, options?: ServiceGetOptions<UserField, UserGetManyDataForFunctionality>) {
    const filter: FilterQuery<DocumentType<UserModel>> = {}
    if (name) filter.name = { $regex: name, $options: 'i' }
    if (options?.functionality) {
      filter._id = { $nin: options.functionality.data.forbiddenUsers }
      filter['roles.role'] = { $nin: options.functionality.data.forbiddenRoles }
      if (options.functionality.data.availableUsersType === FunctionalityAvailableTypeEnum.CUSTOM)
        filter._id = { $in: options.functionality.data.availableUsers, $nin: options.functionality.data.forbiddenRoles }
      if (options.functionality.data.availableRolesType === FunctionalityAvailableTypeEnum.CUSTOM)
        filter['roles.role'] = { $in: options.functionality.data.availableRoles, $nin: options.functionality.data.forbiddenRoles }
    }

    return this.userModel.countDocuments(filter)
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
        for (const field of objectKeys(roleData.data)) {
          if (!checkTypes(roleData.data[field], role.roleFields[field].type))
            throw new BadRequestException(ROLE_INCORRECT_FIELD_TYPE(field))
          if (role.roleFields[field].model) {
            const model = getModelWithString(role.roleFields[field].model as string)
            if (role.roleFields[field].type === TypesEnum.MONGO_ID) {
              if (!(await model?.exists({ _id: roleData.data[field] })))
                throw new BadRequestException(ROLE_INCORRECT_FIELD_VALUE(role.roleFields[field].model as string, roleData.data[field]))
            } else if (role.roleFields[field].type === TypesEnum.MONGO_ID_ARRAY) {
              const ids = roleData.data[field] as Array<any>
              for (const id of ids) {
                if (!(await model?.exists({ _id: id })))
                  throw new BadRequestException(ROLE_INCORRECT_FIELD_VALUE(role.roleFields[field].model as string, id))
              }
            }
          }
        }
      }
    }

    if (dto.views) {
      for await (const viewId of dto.views) await this.viewService.checkExists({ _id: viewId })
    }

    if (dto.available) {
      for (const f of dto.available) {
        this.functionalityService.checkExists({ code: f.code })
        const functionality = this.functionalityService.getByCode(f.code)
        const extraFields = difference(objectKeys(f.data), objectKeys(functionality.default))
        if (extraFields.length) throw new BadRequestException(FUNCTIONALITY_EXTRA_FIELDS(f.code, extraFields))
        const missingFields = difference(objectKeys(functionality.default), objectKeys(f.data))
        if (missingFields.length) throw new BadRequestException(FUNCTIONALITY_MISSING_FIELDS(f.code, missingFields))
        for (const field of objectKeys(f.data)) {
          if (
            functionality.default[field].type === FunctionalityAvailableTypeEnum.ALL ||
            functionality.default[field].type === FunctionalityAvailableTypeEnum.CUSTOM
          ) {
            if (f.data[field] !== FunctionalityAvailableTypeEnum.ALL && f.data[field] !== FunctionalityAvailableTypeEnum.CUSTOM)
              throw new BadRequestException(FUNCTIONALITY_INCORRECT_FIELD_TYPE(field))
          } else {
            if (!checkTypes(f.data[field], functionality.default[field].type as TypesEnum)) {
              throw new BadRequestException(FUNCTIONALITY_INCORRECT_FIELD_TYPE(field))
            }
            if (functionality.default[field].model) {
              const model = getModelWithString(functionality.default[field].model as string)
              if (functionality.default[field].type === TypesEnum.MONGO_ID) {
                if (!(await model?.exists({ _id: f.data[field] }))) {
                  throw new BadRequestException(
                    FUNCTIONALITY_INCORRECT_FIELD_VALUE(functionality.default[field].model as string, f.data[field])
                  )
                }
              } else if (functionality.default[field].type === TypesEnum.MONGO_ID_ARRAY) {
                const ids = f.data[field] as Array<any>
                for (const id of ids) {
                  if (!(await model?.exists({ _id: id }))) {
                    throw new BadRequestException(FUNCTIONALITY_INCORRECT_FIELD_VALUE(functionality.default[field].model as string, id))
                  }
                }
              }
            }
          }
        }
      }
    }

    const set: any = { ...dto }
    if (dto.available) {
      set.available = dto.available.map(funct => ({
        ...funct,
        data: objectKeys(funct.data).map(key => ({
          key,
          value: funct.data[key],
        })),
      }))
    }
    if (dto.roles) {
      set.roles = dto.roles.map(role => ({
        ...role,
        data: objectKeys(role.data).map(key => ({
          key,
          value: role.data[key],
        })),
      }))
    }
    await this.userModel.updateOne({ _id: dto.id }, { $set: set })
  }

  async delete(userId: Types.ObjectId) {
    await this.checkExists({ _id: userId })
    await this.userModel.deleteOne({ _id: userId })
    await this.clearFromId(userId)
    await this.roleService.clearFromId(userId)
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

  async clearFromId(ids: MongoIdString | Types.ObjectId | (MongoIdString | Types.ObjectId)[]) {
    if (!Array.isArray(ids)) ids = [ids]
    ids = ids.map(String)
    const roles = await this.userModel
      .find({ $or: [{ 'available.data.value': { $in: ids } }, { 'roles.data.value': { $in: ids } }] }, { available: 1, roles: 1 })
      .exec()

    for await (const role of roles) {
      let arrays = [role.roles, role.available]
      arrays = arrays.map(array => {
        array = array
          .map(arrayItem => {
            arrayItem.data = arrayItem.data.map(field => {
              if (Array.isArray(field.value)) field.value = field.value.filter(item => !(ids as Array<any>).includes(String(item)))
              return field
            })
            return arrayItem
          })
          .filter(arrayItem => !arrayItem.data.find(field => (ids as Array<any>).includes(field.value))) as any
        return array
      })
      await this.userModel.updateOne({ _id: role.id }, { $set: { roles: arrays[0], available: arrays[1] } })
    }
    return
  }

  async checkExists(
    filter: ObjectByInterface<typeof UserFieldsEnum, ModelBase> | ObjectByInterface<typeof UserFieldsEnum, ModelBase>[],
    options?: { error?: ((filter: ObjectByInterface<typeof UserFieldsEnum, ModelBase>) => Error) | Error; checkExisting?: boolean }
  ) {
    options = { error: f => new NotFoundException(USER_WITH_ID_NOT_FOUND(f._id)), checkExisting: true, ...options }

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
