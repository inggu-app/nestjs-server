import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateCallScheduleDto } from './dto/createCallSchedule.dto'
import { CallScheduleModel } from './callSchedule.model'
import { CheckExistenceService } from '../../global/classes/CheckExistenceService'
import {
  CALL_SCHEDULE_WITH_ID_NOT_FOUND,
  CALL_SCHEDULE_WITH_NAME_EXISTS,
  CALL_SCHEDULE_WITH_NAME_NOT_FOUND,
  DEFAULT_CALL_SCHEDULE_NOT_FOUND,
} from '../../global/constants/errors.constants'
import { QueryOptions, Types } from 'mongoose'
import { UpdateCallScheduleDto } from './dto/updateCallSchedule.dto'
import { callScheduleServiceMethodDefaultOptions } from './callSchedule.constants'
import { mergeOptionsWithDefaultOptions } from '../../global/utils/serviceMethodOptions'

@Injectable()
export class CallScheduleService extends CheckExistenceService<CallScheduleModel> {
  constructor(@InjectModel(CallScheduleModel) private readonly callScheduleModel: ModelType<CallScheduleModel>) {
    super(callScheduleModel, undefined, callSchedule => CALL_SCHEDULE_WITH_ID_NOT_FOUND(callSchedule._id))
  }

  async create(dto: CreateCallScheduleDto, options = callScheduleServiceMethodDefaultOptions.create) {
    options = mergeOptionsWithDefaultOptions(options, callScheduleServiceMethodDefaultOptions.create)
    if (options.checkExistence.callSchedule)
      await this.throwIfExists({ name: dto.name }, { error: CALL_SCHEDULE_WITH_NAME_EXISTS(dto.name) })
    return this.callScheduleModel.create({
      schedule: dto.schedule,
      name: dto.name,
    })
  }

  async getById(id: Types.ObjectId, queryOptions?: QueryOptions, options = callScheduleServiceMethodDefaultOptions.getById) {
    options = mergeOptionsWithDefaultOptions(options, callScheduleServiceMethodDefaultOptions.getById)
    if (options.checkExistence.callSchedule) await this.throwIfNotExists({ _id: id })
    return this.callScheduleModel.findById(id, undefined, queryOptions)
  }

  async getByName(name: string, queryOptions?: QueryOptions, options = callScheduleServiceMethodDefaultOptions.getByName) {
    options = mergeOptionsWithDefaultOptions(options, callScheduleServiceMethodDefaultOptions.getByName)
    if (options.checkExistence.callSchedule) await this.throwIfNotExists({ name }, { error: CALL_SCHEDULE_WITH_NAME_NOT_FOUND(name) })
    return this.callScheduleModel.findOne({ name }, undefined, queryOptions)
  }

  async getDefaultSchedule(queryOptions?: QueryOptions, options = callScheduleServiceMethodDefaultOptions.getDefaultSchedule) {
    options = mergeOptionsWithDefaultOptions(options, callScheduleServiceMethodDefaultOptions.getDefaultSchedule)
    if (options.checkExistence.callSchedule) await this.throwIfNotExists({ isDefault: true }, { error: DEFAULT_CALL_SCHEDULE_NOT_FOUND })
    return this.callScheduleModel.findOne({ isDefault: true }, undefined, queryOptions)
  }

  async update(dto: UpdateCallScheduleDto, options = callScheduleServiceMethodDefaultOptions.update) {
    options = mergeOptionsWithDefaultOptions(options, callScheduleServiceMethodDefaultOptions.update)
    const { id, ...fields } = dto
    if (options.checkExistence.callSchedule) await this.throwIfNotExists({ _id: dto.id })
    if (fields.schedule) return this.callScheduleModel.updateOne({ _id: id }, { $set: { ...fields, scheduleUpdatedAt: new Date() } })
    return this.callScheduleModel.updateOne({ _id: dto.id }, { $set: fields })
  }

  async updateDefaultSchedule(id: Types.ObjectId, options = callScheduleServiceMethodDefaultOptions.updateDefaultSchedule) {
    options = mergeOptionsWithDefaultOptions(options, callScheduleServiceMethodDefaultOptions.updateDefaultSchedule)
    if (options.checkExistence.callSchedule) await this.throwIfNotExists({ _id: id })
    await this.callScheduleModel.updateOne({ isDefault: true }, { $set: { isDefault: false } })
    return this.callScheduleModel.updateOne({ _id: id }, { $set: { isDefault: true } })
  }

  async deleteById(id: Types.ObjectId, options = callScheduleServiceMethodDefaultOptions.deleteById) {
    options = mergeOptionsWithDefaultOptions(options, callScheduleServiceMethodDefaultOptions.deleteById)
    if (options.checkExistence.callSchedule) await this.throwIfNotExists({ _id: id })
    return this.callScheduleModel.deleteOne({ _id: id })
  }

  async deleteByName(name: string, options = callScheduleServiceMethodDefaultOptions.deleteByName) {
    options = mergeOptionsWithDefaultOptions(options, callScheduleServiceMethodDefaultOptions.deleteByName)
    if (options.checkExistence.callSchedule) await this.throwIfNotExists({ name }, { error: CALL_SCHEDULE_WITH_NAME_NOT_FOUND(name) })
    return this.callScheduleModel.deleteOne({ name })
  }
}
