import { Injectable, NotFoundException } from '@nestjs/common'
import { Error, QueryOptions, Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { AdminUserModel } from './adminUser.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ModelBase, ObjectByInterface } from '../../global/types'
import { FacultyFieldsEnum } from '../faculty/faculty.constants'
import { FACULTY_WITH_ID_NOT_FOUND } from '../../global/constants/errors.constants'

@Injectable()
export class AdminUserService {
  constructor(@InjectModel(AdminUserModel) private readonly adminUserModel: ModelType<AdminUserModel>) {}

  async getById(id: Types.ObjectId, queryOptions?: QueryOptions) {
    return this.adminUserModel.findById(id, undefined, queryOptions)
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
