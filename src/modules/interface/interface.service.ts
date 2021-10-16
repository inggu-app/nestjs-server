import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { InterfaceModel } from './interface.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateInterfaceDto } from './dto/createInterface.dto'
import { ModelBase, MongoIdString, ObjectByInterface, ServiceGetOptions } from '../../global/types'
import { Error, FilterQuery, Types } from 'mongoose'
import {
  INTERFACE_WITH_CODE_EXISTS,
  INTERFACE_WITH_CODE_NOT_FOUND,
  INTERFACE_WITH_ID_NOT_FOUND,
} from '../../global/constants/errors.constants'
import { InterfaceField, InterfaceFieldsEnum } from './interface.constants'
import { stringToObjectId } from '../../global/utils/stringToObjectId'
import { DocumentType } from '@typegoose/typegoose'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { UpdateInterfaceDto } from './dto/updateInterface.dto'

@Injectable()
export class InterfaceService {
  constructor(@InjectModel(InterfaceModel) private readonly interfaceModel: ModelType<InterfaceModel>) {}

  async create(dto: CreateInterfaceDto) {
    await this.checkExists({ code: dto.code }, new BadRequestException(INTERFACE_WITH_CODE_EXISTS(dto.code)), false)
    return this.interfaceModel.create(dto)
  }

  async getById(id: Types.ObjectId | MongoIdString, options?: ServiceGetOptions<InterfaceField>) {
    id = stringToObjectId(id)
    await this.checkExists({ _id: id })
    return this.interfaceModel.findById(
      id,
      Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields,
      options?.queryOptions
    ) as unknown as DocumentType<InterfaceModel>
  }

  async getByCode(code: string, options?: ServiceGetOptions<InterfaceField>) {
    await this.checkExists({ code }, new BadRequestException(INTERFACE_WITH_CODE_NOT_FOUND(code)))
    return this.interfaceModel.findOne(
      { code },
      Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields,
      options?.queryOptions
    ) as unknown as DocumentType<InterfaceModel>
  }

  async update(dto: UpdateInterfaceDto) {
    await this.checkExists({ code: dto.code }, new BadRequestException(INTERFACE_WITH_CODE_NOT_FOUND(dto.code)))
    await this.interfaceModel.updateOne({ code: dto.code }, { $set: dto })
    return
  }

  async delete(id: Types.ObjectId | MongoIdString) {
    id = stringToObjectId(id)
    await this.checkExists({ _id: id })
    await this.interfaceModel.deleteOne({ _id: id })
    return
  }

  async checkExists(
    filter: FilterQuery<DocumentType<InterfaceModel>>,
    error: ((filter: ObjectByInterface<typeof InterfaceFieldsEnum, ModelBase>) => Error) | Error = f =>
      new NotFoundException(INTERFACE_WITH_ID_NOT_FOUND(f._id)),
    checkExisting = true
  ) {
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.interfaceModel.exists(f)

        if (!candidate && checkExisting) {
          if (typeof error === 'function') throw error(f)
          throw error
        } else if (candidate && !checkExisting) {
          if (typeof error === 'function') throw error(f)
          throw error
        }
      }
    } else {
      const candidate = await this.interfaceModel.exists(filter)
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
