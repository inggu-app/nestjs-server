import { Injectable } from '@nestjs/common'
import { FilterQuery, QueryOptions, Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { AdminUserModel, TokenDataModel } from './adminUser.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import {
  ADMIN_USER_WITH_ID_NOT_FOUND,
  ADMIN_USER_WITH_LOGIN_EXISTS,
  ADMIN_USER_WITH_LOGIN_NOT_FOUND,
} from '../../global/constants/errors.constants'
import { AvailabilityDto, CreateAdminUserDto } from './dto/createAdminUser.dto'
import { DocumentType } from '@typegoose/typegoose'
import { UpdateAdminUserDto } from './dto/updateAdminUser.dto'
import * as bcrypt from 'bcrypt'
import { CheckExistenceService } from '../../global/classes/CheckExistenceService'
import { adminUserServiceMethodDefaultOptions } from './adminUser.constants'
import { mergeOptionsWithDefaultOptions } from '../../global/utils/serviceMethodOptions'

@Injectable()
export class AdminUserService extends CheckExistenceService<AdminUserModel> {
  constructor(@InjectModel(AdminUserModel) private readonly adminUserModel: ModelType<AdminUserModel>) {
    super(adminUserModel, undefined, user => ADMIN_USER_WITH_ID_NOT_FOUND(user._id))
  }

  async create(dto: CreateAdminUserDto, options = adminUserServiceMethodDefaultOptions.create) {
    options = mergeOptionsWithDefaultOptions(options, adminUserServiceMethodDefaultOptions.create)
    if (options.checkExistence.adminUser) await this.throwIfExists({ login: dto.login }, { error: ADMIN_USER_WITH_LOGIN_EXISTS(dto.login) })

    const { password, ...fields } = dto
    const hashedPassword = await bcrypt.hash(password, 8)
    return this.adminUserModel.create({ ...fields, hashedPassword })
  }

  async getById(id: Types.ObjectId, queryOptions?: QueryOptions, options = adminUserServiceMethodDefaultOptions.getById) {
    options = mergeOptionsWithDefaultOptions(options, adminUserServiceMethodDefaultOptions.getById)
    if (options.checkExistence.adminUser) await this.throwIfNotExists({ _id: id })
    return this.adminUserModel.findById(id, undefined, queryOptions) as unknown as DocumentType<AdminUserModel>
  }

  async getByLogin(login: string, queryOptions?: QueryOptions, options = adminUserServiceMethodDefaultOptions.getByLogin) {
    options = mergeOptionsWithDefaultOptions(options, adminUserServiceMethodDefaultOptions.getByLogin)
    if (options.checkExistence.adminUser) await this.throwIfNotExists({ login }, { error: ADMIN_USER_WITH_LOGIN_NOT_FOUND(login) })
    return this.adminUserModel.findOne({ login }, undefined, queryOptions) as unknown as DocumentType<AdminUserModel>
  }

  async getByIds(ids: Types.ObjectId[], queryOptions?: QueryOptions, options = adminUserServiceMethodDefaultOptions.getByIds) {
    options = mergeOptionsWithDefaultOptions(options, adminUserServiceMethodDefaultOptions.getByIds)
    if (options.checkExistence.adminUser) await this.throwIfNotExists(ids.map(id => ({ _id: id })))
    return this.adminUserModel.find({ _id: { $in: ids } }, undefined, queryOptions)
  }

  async getMany(
    page: number,
    count: number,
    name?: string,
    queryOptions?: QueryOptions,
    options = adminUserServiceMethodDefaultOptions.getMany
  ) {
    const filter: FilterQuery<DocumentType<AdminUserModel>> = {}
    if (name) filter.title = { $regex: name, $options: 'i' }

    return this.adminUserModel
      .find(filter, undefined, queryOptions)
      .skip((page - 1) * count)
      .limit(count)
      .exec()
  }

  async countMany(name?: string, options = adminUserServiceMethodDefaultOptions.countMany) {
    const filter: FilterQuery<DocumentType<AdminUserModel>> = {}
    if (name) filter.name = { $regex: name, $options: 'i' }

    return this.adminUserModel.countDocuments(filter).exec()
  }

  async update(dto: UpdateAdminUserDto, options = adminUserServiceMethodDefaultOptions.update) {
    options = mergeOptionsWithDefaultOptions(options, adminUserServiceMethodDefaultOptions.update)
    if (options.checkExistence.adminUser) await this.throwIfNotExists({ _id: Types.ObjectId(dto.id) })
    const { id, ...fields } = dto
    return this.adminUserModel.updateOne({ _id: id }, { $set: fields })
  }

  async updatePassword(login: string, password: string, options = adminUserServiceMethodDefaultOptions.updatePassword) {
    options = mergeOptionsWithDefaultOptions(options, adminUserServiceMethodDefaultOptions.updatePassword)
    if (options.checkExistence.adminUser) await this.throwIfNotExists({ login })
    const hashedPassword = await bcrypt.hash(password, 8)
    return this.adminUserModel.updateOne({ login }, { $set: { hashedPassword, tokens: [] } })
  }

  async updateAvailability(
    id: Types.ObjectId,
    availabilityDto: AvailabilityDto,
    options = adminUserServiceMethodDefaultOptions.updateAvailability
  ) {
    options = mergeOptionsWithDefaultOptions(options, adminUserServiceMethodDefaultOptions.updateAvailability)
    if (options.checkExistence.adminUser) await this.throwIfNotExists({ _id: id })
    const adminUser = await this.getById(id, { projection: { _id: 0, availability: 1 } }, { checkExistence: { adminUser: false } })
    return this.adminUserModel.updateOne(
      { _id: id },
      { $set: { availability: { ...(adminUser.toObject() as DocumentType<AdminUserModel>).availability, ...availabilityDto } } }
    )
  }

  async addToken(id: Types.ObjectId, tokenData: TokenDataModel, options = adminUserServiceMethodDefaultOptions.addToken) {
    options = mergeOptionsWithDefaultOptions(options, adminUserServiceMethodDefaultOptions.addToken)
    if (options.checkExistence.adminUser) await this.throwIfNotExists({ _id: id })
    return this.adminUserModel.updateOne({ _id: id }, { $push: { tokens: tokenData } })
  }

  async deleteToken(id: Types.ObjectId, token: string, options = adminUserServiceMethodDefaultOptions.deleteToken) {
    options = mergeOptionsWithDefaultOptions(options, adminUserServiceMethodDefaultOptions.deleteToken)
    if (options.checkExistence.adminUser) await this.throwIfNotExists({ _id: id })
    return this.adminUserModel.updateOne({ _id: id }, { $pull: { tokens: { token } } })
  }

  async checkTokenExists(id: Types.ObjectId, token: string, options = adminUserServiceMethodDefaultOptions.checkTokenExists) {
    options = mergeOptionsWithDefaultOptions(options, adminUserServiceMethodDefaultOptions.checkTokenExists)
    if (options.checkExistence.adminUser) await this.throwIfNotExists({ _id: id })
    return this.adminUserModel.exists({ _id: id, 'tokens.token': token })
  }

  deleteExpiredTokens(options = adminUserServiceMethodDefaultOptions.deleteExpiredTokens) {
    return this.adminUserModel.updateMany(
      { 'tokens.expiresIn': { $lt: new Date() } },
      { $pull: { tokens: { expiresIn: { $lt: new Date() } } } }
    )
  }

  async deleteById(id: Types.ObjectId, options = adminUserServiceMethodDefaultOptions.deleteById) {
    options = mergeOptionsWithDefaultOptions(options, adminUserServiceMethodDefaultOptions.deleteById)
    if (options.checkExistence.adminUser) await this.throwIfNotExists({ _id: id })
    return this.adminUserModel.deleteOne({ _id: id })
  }
}
