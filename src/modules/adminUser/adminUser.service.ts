import { Injectable, NotFoundException } from '@nestjs/common'
import { Error, FilterQuery, QueryOptions, Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { AdminUserModel } from './adminUser.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ModelBase, ObjectByInterface } from '../../global/types'
import { FacultyFieldsEnum } from '../faculty/faculty.constants'
import { FACULTY_WITH_ID_NOT_FOUND } from '../../global/constants/errors.constants'
import { AvailabilityDto, CreateAdminUserDto } from './dto/createAdminUser.dto'
import { DocumentType } from '@typegoose/typegoose'
import { UpdateAdminUserDto } from './dto/updateAdminUser.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AdminUserService {
  constructor(@InjectModel(AdminUserModel) private readonly adminUserModel: ModelType<AdminUserModel>) {}

  async create(dto: CreateAdminUserDto) {
    return this.adminUserModel.create(dto)
  }

  async getById(id: Types.ObjectId, queryOptions?: QueryOptions) {
    return this.adminUserModel.findById(id, undefined, queryOptions)
  }

  async getByIds(ids: Types.ObjectId[], queryOptions?: QueryOptions) {
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
    const { id, ...fields } = dto
    return this.adminUserModel.updateOne({ _id: id }, { $set: fields })
  }

  async updatePassword(id: Types.ObjectId, password: string) {
    const hashedPassword = await bcrypt.hash(password, 8)
    return this.adminUserModel.updateOne({ _id: id }, { $set: { hashedPassword } })
  }

  async updateAvailability(id: Types.ObjectId, availabilityDto: AvailabilityDto) {
    const adminUser = (await this.getById(id, { projection: { _id: 0, availability: 1 } })) as Pick<AdminUserModel, 'availability'>
    return this.adminUserModel.updateOne({ _id: id }, { $set: { availability: { ...adminUser.availability, ...availabilityDto } } })
  }

  async deleteById(id: Types.ObjectId) {
    return this.adminUserModel.deleteOne({ _id: id })
  }

  async checkExists(
    filter: any,
    options?: { error?: ((filter: ObjectByInterface<typeof FacultyFieldsEnum, ModelBase>) => Error) | Error; checkExisting?: boolean }
  ) {
    options = {
      error: f => new NotFoundException(FACULTY_WITH_ID_NOT_FOUND(f._id)),
      checkExisting: true,
      ...options,
    }
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.adminUserModel.exists(f)

        if (!candidate && options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        } else if (candidate && !options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        }
      }
    } else {
      const candidate = await this.adminUserModel.exists(filter)

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
