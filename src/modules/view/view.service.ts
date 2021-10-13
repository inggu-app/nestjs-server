import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ViewModel } from './view.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateViewDto } from './dto/createView.dto'
import { Error, QueryOptions, Types } from 'mongoose'
import { ModelBase, MongoIdString, ObjectByInterface } from '../../global/types'
import { ViewField, ViewFieldsEnum } from './view.constants'
import { stringToObjectId } from '../../global/utils/stringToObjectId'
import { VIEW_WITH_CODE_EXISTS, VIEW_WITH_CODE_NOT_FOUND, VIEW_WITH_ID_NOT_FOUND } from '../../global/constants/errors.constants'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { DocumentType } from '@typegoose/typegoose'
import { UpdateViewDto } from './dto/updateView.dto'

@Injectable()
export class ViewService {
  constructor(@InjectModel(ViewModel) private readonly viewModel: ModelType<ViewModel>) {}

  async create(dto: CreateViewDto) {
    await this.checkExists({ code: dto.code }, new BadRequestException(VIEW_WITH_CODE_EXISTS(dto.code)), false)
    await this.viewModel.create(dto)
    return
  }

  async getById(id: Types.ObjectId | MongoIdString, options?: { fields?: ViewField[]; queryOptions?: QueryOptions }) {
    id = stringToObjectId(id)
    await this.checkExists({ _id: id })

    return this.viewModel.findById(
      id,
      fieldsArrayToProjection(options?.fields),
      options?.queryOptions
    ) as unknown as DocumentType<ViewModel>
  }

  async getByCode(code: string, options?: { fields?: ViewField[]; queryOptions?: QueryOptions }) {
    await this.checkExists({ code }, new BadRequestException(VIEW_WITH_CODE_NOT_FOUND(code)))

    return this.viewModel.findOne(
      { code },
      fieldsArrayToProjection(options?.fields),
      options?.queryOptions
    ) as unknown as DocumentType<ViewModel>
  }

  async update(dto: UpdateViewDto) {
    await this.checkExists({ code: dto.code })
    await this.viewModel.updateOne({ code: dto.code }, { $set: dto })
  }

  async delete(id: Types.ObjectId | MongoIdString) {
    await this.checkExists({ _id: id })
    await this.viewModel.deleteOne({ _id: id })
    return
  }

  async checkExists(
    filter: ObjectByInterface<typeof ViewFieldsEnum, ModelBase> | ObjectByInterface<typeof ViewFieldsEnum, ModelBase>[],
    error: ((filter: ObjectByInterface<typeof ViewFieldsEnum, ModelBase>) => Error) | Error = f =>
      new NotFoundException(VIEW_WITH_ID_NOT_FOUND(f._id)),
    checkExisting = true
  ) {
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.viewModel.exists(f)

        if (!candidate && checkExisting) {
          if (typeof error === 'function') throw error(f)
          throw error
        } else if (candidate && !checkExisting) {
          if (typeof error === 'function') throw error(f)
          throw error
        }
      }
    } else {
      const candidate = await this.viewModel.exists(filter)
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
