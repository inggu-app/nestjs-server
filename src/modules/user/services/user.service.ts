import { Injectable } from '@nestjs/common'
import { FilterQuery, QueryOptions, Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel, TokenDataModel } from '../models/user.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { USER_WITH_ID_NOT_FOUND, USER_WITH_LOGIN_EXISTS, USER_WITH_LOGIN_NOT_FOUND } from '../../../global/constants/errors.constants'
import { AvailabilitiesDto, CreateUserDto } from '../dto/user/createUser.dto'
import { DocumentType } from '@typegoose/typegoose'
import { UpdateUserDto } from '../dto/user/updateUser.dto'
import * as bcrypt from 'bcrypt'
import { CheckExistenceService } from '../../../global/classes/CheckExistenceService'
import { userServiceMethodDefaultOptions } from '../constants/user.constants'
import { mergeOptionsWithDefaultOptions } from '../../../global/utils/serviceMethodOptions'
import { RoleService } from './role.service'
import { RoleModel } from '../models/role.model'
import { FacultyModel } from '../../faculty/faculty.model'
import { GroupModel } from '../../group/group.model'

@Injectable()
export class UserService extends CheckExistenceService<UserModel> {
  constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>, private readonly roleService: RoleService) {
    super(userModel, undefined, user => USER_WITH_ID_NOT_FOUND(user._id))
  }

  async create(dto: CreateUserDto, options = userServiceMethodDefaultOptions.create) {
    options = mergeOptionsWithDefaultOptions(options, userServiceMethodDefaultOptions.create)
    if (options.checkExistence.roles) await this.roleService.throwIfNotExists(dto.roles.map(role => ({ _id: role })))
    await this.throwIfExists({ login: dto.login }, { error: USER_WITH_LOGIN_EXISTS(dto.login) })

    const { password, ...fields } = dto
    const hashedPassword = await bcrypt.hash(password, 8)
    return this.userModel.create({ ...fields, hashedPassword })
  }

  async getById(id: Types.ObjectId, queryOptions?: QueryOptions, options = userServiceMethodDefaultOptions.getById) {
    options = mergeOptionsWithDefaultOptions(options, userServiceMethodDefaultOptions.getById)
    if (options.checkExistence.user) await this.throwIfNotExists({ _id: id })
    return this.userModel.findById(id, undefined, queryOptions) as unknown as DocumentType<UserModel>
  }

  async getByLogin(login: string, queryOptions?: QueryOptions, options = userServiceMethodDefaultOptions.getByLogin) {
    options = mergeOptionsWithDefaultOptions(options, userServiceMethodDefaultOptions.getByLogin)
    if (options.checkExistence.user) await this.throwIfNotExists({ login }, { error: USER_WITH_LOGIN_NOT_FOUND(login) })
    return this.userModel.findOne({ login }, undefined, queryOptions) as unknown as DocumentType<UserModel>
  }

  async getByIds(ids: Types.ObjectId[], queryOptions?: QueryOptions, options = userServiceMethodDefaultOptions.getByIds) {
    options = mergeOptionsWithDefaultOptions(options, userServiceMethodDefaultOptions.getByIds)
    if (options.checkExistence.user) await this.throwIfNotExists(ids.map(id => ({ _id: id })))
    return this.userModel.find({ _id: { $in: ids } }, undefined, queryOptions)
  }

  async getMany(page: number, count: number, name?: string, queryOptions?: QueryOptions, in_?: Types.ObjectId[]) {
    const filter: FilterQuery<DocumentType<UserModel>> = {}
    if (name) filter.name = { $regex: name, $options: 'i' }
    if (in_) filter._id = { $in: in_ }

    return this.userModel
      .find(filter, undefined, queryOptions)
      .skip((page - 1) * count)
      .limit(count)
      .exec()
  }

  async countMany(name?: string, in_?: Types.ObjectId[]) {
    const filter: FilterQuery<DocumentType<UserModel>> = {}
    if (name) filter.name = { $regex: name, $options: 'i' }
    if (in_) filter._id = { $in: in_ }

    return this.userModel.countDocuments(filter).exec()
  }

  async update(dto: UpdateUserDto, options = userServiceMethodDefaultOptions.update) {
    options = mergeOptionsWithDefaultOptions(options, userServiceMethodDefaultOptions.update)
    if (options.checkExistence.user) await this.throwIfNotExists({ _id: dto.id })
    if (dto.roles && options.checkExistence.roles) await this.roleService.throwIfNotExists(dto.roles.map(role => ({ _id: role })))
    const { id, ...fields } = dto
    return this.userModel.updateOne({ _id: id }, { $set: fields })
  }

  async updatePassword(login: string, password: string, options = userServiceMethodDefaultOptions.updatePassword) {
    options = mergeOptionsWithDefaultOptions(options, userServiceMethodDefaultOptions.updatePassword)
    if (options.checkExistence.user) await this.throwIfNotExists({ login })
    const hashedPassword = await bcrypt.hash(password, 8)
    return this.userModel.updateOne({ login }, { $set: { hashedPassword, tokens: [] } })
  }

  async updateAvailability(
    id: Types.ObjectId,
    availabilitiesDto: AvailabilitiesDto,
    options = userServiceMethodDefaultOptions.updateAvailability
  ) {
    options = mergeOptionsWithDefaultOptions(options, userServiceMethodDefaultOptions.updateAvailability)
    if (options.checkExistence.user) await this.throwIfNotExists({ _id: id })
    const user = await this.getById(id, { projection: { _id: 0, availabilities: 1 } }, { checkExistence: { user: false } })
    return this.userModel.updateOne(
      { _id: id },
      { $set: { availabilities: { ...(user.toObject() as DocumentType<UserModel>).availabilities, ...availabilitiesDto } } }
    )
  }

  async addToken(id: Types.ObjectId, tokenData: TokenDataModel, options = userServiceMethodDefaultOptions.addToken) {
    options = mergeOptionsWithDefaultOptions(options, userServiceMethodDefaultOptions.addToken)
    if (options.checkExistence.user) await this.throwIfNotExists({ _id: id })
    return this.userModel.updateOne({ _id: id }, { $push: { tokens: tokenData } })
  }

  async deleteToken(id: Types.ObjectId, token: string, options = userServiceMethodDefaultOptions.deleteToken) {
    options = mergeOptionsWithDefaultOptions(options, userServiceMethodDefaultOptions.deleteToken)
    if (options.checkExistence.user) await this.throwIfNotExists({ _id: id })
    return this.userModel.updateOne({ _id: id }, { $pull: { tokens: { token } } })
  }

  async checkTokenExists(id: Types.ObjectId, token: string, options = userServiceMethodDefaultOptions.checkTokenExists) {
    options = mergeOptionsWithDefaultOptions(options, userServiceMethodDefaultOptions.checkTokenExists)
    if (options.checkExistence.user) await this.throwIfNotExists({ _id: id })
    return this.userModel.exists({ _id: id, 'tokens.token': token })
  }

  deleteExpiredTokens() {
    return this.userModel.updateMany({ 'tokens.expiresIn': { $lt: new Date() } }, { $pull: { tokens: { expiresIn: { $lt: new Date() } } } })
  }

  async deleteById(id: Types.ObjectId, options = userServiceMethodDefaultOptions.deleteById) {
    options = mergeOptionsWithDefaultOptions(options, userServiceMethodDefaultOptions.deleteById)
    if (options.checkExistence.user) await this.throwIfNotExists({ _id: id })
    await this.clearFrom(id, UserModel)
    return this.userModel.deleteOne({ _id: id })
  }

  async clearFrom(
    ids: Types.ObjectId | Types.ObjectId[],
    model: typeof RoleModel | typeof FacultyModel | typeof GroupModel | typeof UserModel
  ) {
    if (!Array.isArray(ids)) ids = [ids]

    let paths: string[] = []
    switch (model.name) {
      case RoleModel.name:
        await this.userModel.updateMany({ roles: { $in: ids } }, { $pullAll: { roles: { $in: ids } } })
        paths = [
          'availabilities.createUser.availableForInstallationRoles',
          'availabilities.updateUser.availableRoles',
          'availabilities.deleteUser.availableRoles',
          'availabilities.updateUserPassword.availableRoles',
          'availabilities.updateUserAvailabilities.availableRoles',
          'availabilities.updateRole.availableRoles',
        ]
        break
      case FacultyModel.name:
        paths = [
          'availabilities.createSchedule.availableFaculties',
          'availabilities.createGroup.availableFaculties',
          'availabilities.updateGroup.availableForUpdateFaculties',
          'availabilities.updateGroup.availableForInstallationFaculties',
          'availabilities.deleteGroup.availableFaculties',
          'availabilities.updateFaculty.availableFaculties',
          'availabilities.deleteFaculty.availableFaculties',
        ]
        break
      case GroupModel.name:
        paths = [
          'availabilities.createSchedule.availableGroups',
          'availabilities.createSchedule.forbiddenGroups',
          'availabilities.updateGroup.availableGroups',
          'availabilities.updateGroup.forbiddenGroups',
          'availabilities.deleteGroup.availableGroups',
          'availabilities.deleteGroup.forbiddenGroups',
        ]
        break
      case UserModel.name:
        paths = [
          'availabilities.updateUser.forbiddenUsers',
          'availabilities.updateUser.availableUsers',
          'availabilities.deleteUser.forbiddenUsers',
          'availabilities.deleteUser.availableUsers',
          'availabilities.updateUserPassword.forbiddenUsers',
          'availabilities.updateUserPassword.availableUsers',
          'availabilities.updateUserAvailabilities.forbiddenUsers',
          'availabilities.updateUserAvailabilities.availableUsers',
        ]
        break
    }
    return this.userModel.updateMany(
      {
        $or: paths.map(path => ({ [path]: { $in: ids } })),
      },
      {
        $pullAll: paths.reduce((obj, path) => {
          obj[path] = ids
          return obj
        }, {} as Record<typeof paths[number], any>),
      }
    )
  }
}
