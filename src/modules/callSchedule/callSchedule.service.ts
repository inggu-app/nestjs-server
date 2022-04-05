import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateCallScheduleDto } from './dto/createCallSchedule.dto'
import { CallScheduleModel } from './callSchedule.model'
import { CheckExistenceService } from '../../global/classes/CheckExistenceService'
import {
  CALL_SCHEDULE_WITH_ID_NOT_FOUND,
  CALL_SCHEDULE_WITH_NAME_EXISTS,
  DEFAULT_CALL_SCHEDULE_NOT_FOUND,
} from '../../global/constants/errors.constants'
import { QueryOptions, Types } from 'mongoose'
import { UpdateCallScheduleDto } from './dto/updateCallSchedule.dto'
import { callScheduleServiceMethodDefaultOptions } from './callSchedule.constants'
import { mergeOptionsWithDefaultOptions } from '../../global/utils/serviceMethodOptions'
import { UserService } from '../user/services/user.service'
import { FacultyService } from '../faculty/faculty.service'
import { GroupService } from '../group/services/group.service'

@Injectable()
export class CallScheduleService extends CheckExistenceService<CallScheduleModel> {
  constructor(
    @InjectModel(CallScheduleModel) private readonly callScheduleModel: ModelType<CallScheduleModel>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => FacultyService)) private readonly facultyService: FacultyService,
    @Inject(forwardRef(() => GroupService)) private readonly groupService: GroupService
  ) {
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
    if (fields.isDefault) await this.callScheduleModel.updateOne({ isDefault: true }, { $set: { isDefault: false } })
    return this.callScheduleModel.updateOne({ _id: dto.id }, { $set: fields })
  }

  async deleteById(id: Types.ObjectId, options = callScheduleServiceMethodDefaultOptions.deleteById) {
    options = mergeOptionsWithDefaultOptions(options, callScheduleServiceMethodDefaultOptions.deleteById)
    if (options.checkExistence.callSchedule) await this.throwIfNotExists({ _id: id })
    await this.userService.clearFrom(id, CallScheduleModel)
    await this.facultyService.clearFrom(id)
    return this.callScheduleModel.deleteOne({ _id: id })
  }
}
