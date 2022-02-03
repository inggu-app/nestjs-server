import { Injectable } from '@nestjs/common'
import { FilterQuery, QueryOptions, Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { AdminUserModel } from './adminUser.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ADMIN_USER_WITH_ID_NOT_FOUND, ADMIN_USER_WITH_LOGIN_EXISTS } from '../../global/constants/errors.constants'
import { AvailabilityDto, CreateAdminUserDto } from './dto/createAdminUser.dto'
import { DocumentType } from '@typegoose/typegoose'
import { UpdateAdminUserDto } from './dto/updateAdminUser.dto'
import * as bcrypt from 'bcrypt'
import { CheckExistenceService } from '../../global/classes/CheckExistenceService'

@Injectable()
export class AdminUserService extends CheckExistenceService<AdminUserModel> {
  constructor(@InjectModel(AdminUserModel) private readonly adminUserModel: ModelType<AdminUserModel>) {
    super(adminUserModel, undefined, user => ADMIN_USER_WITH_ID_NOT_FOUND(user._id))
  }

  async create(dto: CreateAdminUserDto) {
    await this.throwIfExists({ login: dto.login }, { error: ADMIN_USER_WITH_LOGIN_EXISTS(dto.login) })

    return this.adminUserModel.create(dto)
  }

  async getById(id: Types.ObjectId, queryOptions?: QueryOptions) {
    await this.throwIfNotExists({ _id: id })
    return this.adminUserModel.findById(id, undefined, queryOptions) as unknown as DocumentType<AdminUserModel>
  }

  async getByIds(ids: Types.ObjectId[], queryOptions?: QueryOptions) {
    await this.throwIfNotExists(ids.map(id => ({ _id: id })))
    return this.adminUserModel.find({ _id: { $in: ids } }, undefined, queryOptions)
  }

  async getMany(page: number, count: number, name?: string, queryOptions?: QueryOptions) {
    const filter: FilterQuery<DocumentType<AdminUserModel>> = {}
    if (name) filter.title = { $regex: name, $options: 'i' }

    return this.adminUserModel
      .find(filter, undefined, queryOptions)
      .skip((page - 1) * count)
      .limit(count)
      .exec()
  }

  async countMany(name?: string) {
    const filter: FilterQuery<DocumentType<AdminUserModel>> = {}
    if (name) filter.name = { $regex: name, $options: 'i' }

    return this.adminUserModel.countDocuments(filter).exec()
  }

  async update(dto: UpdateAdminUserDto) {
    await this.throwIfNotExists({ _id: Types.ObjectId(dto.id) })
    const { id, ...fields } = dto
    return this.adminUserModel.updateOne({ _id: id }, { $set: fields })
  }

  async updatePassword(id: Types.ObjectId, password: string) {
    await this.throwIfNotExists({ _id: id })
    const hashedPassword = await bcrypt.hash(password, 8)
    return this.adminUserModel.updateOne({ _id: id }, { $set: { hashedPassword } })
  }

  async updateAvailability(id: Types.ObjectId, availabilityDto: AvailabilityDto) {
    await this.throwIfNotExists({ _id: id })
    const adminUser = (await this.getById(id, { projection: { _id: 0, availability: 1 } })) as Pick<AdminUserModel, 'availability'>
    return this.adminUserModel.updateOne({ _id: id }, { $set: { availability: { ...adminUser.availability, ...availabilityDto } } })
  }

  async deleteById(id: Types.ObjectId) {
    await this.throwIfNotExists({ _id: id })
    return this.adminUserModel.deleteOne({ _id: id })
  }
}
