import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GroupModel } from './group.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { DocumentType } from '@typegoose/typegoose'
import { CreateGroupDto } from './dto/createGroup.dto'
import { FilterQuery, QueryOptions, Types } from 'mongoose'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { FacultyService } from '../faculty/faculty.service'
import { GROUP_WITH_ID_NOT_FOUND, GROUP_WITH_TITLE_EXISTS } from '../../global/constants/errors.constants'
import { CheckExistenceService } from '../../global/classes/CheckExistenceService'
import { CallScheduleService } from '../callSchedule/callSchedule.service'
import { ScheduleService } from '../schedule/schedule.service'
import { groupServiceMethodDefaultOptions } from './group.constants'
import { mergeOptionsWithDefaultOptions } from '../../global/utils/serviceMethodOptions'

@Injectable()
export class GroupService extends CheckExistenceService<GroupModel> {
  constructor(
    @InjectModel(GroupModel) private readonly groupModel: ModelType<GroupModel>,
    @Inject(forwardRef(() => FacultyService)) private readonly facultyService: FacultyService,
    private readonly scheduleService: ScheduleService,
    private readonly callScheduleService: CallScheduleService
  ) {
    super(groupModel, undefined, group => GROUP_WITH_ID_NOT_FOUND(group._id))
  }

  async create(dto: CreateGroupDto, options = groupServiceMethodDefaultOptions.create) {
    options = mergeOptionsWithDefaultOptions(options, groupServiceMethodDefaultOptions.create)
    if (options.checkExistence.group)
      await this.throwIfExists({ title: dto.title, faculty: dto.faculty }, { error: GROUP_WITH_TITLE_EXISTS(dto.title) })
    if (options.checkExistence.faculty) await this.facultyService.throwIfNotExists({ _id: dto.faculty })
    if (dto.callSchedule && options.checkExistence.callSchedule) await this.callScheduleService.throwIfNotExists({ _id: dto.callSchedule })
    return this.groupModel.create(dto)
  }

  async getById(groupId: Types.ObjectId, queryOptions?: QueryOptions, options = groupServiceMethodDefaultOptions.getById) {
    options = mergeOptionsWithDefaultOptions(options, groupServiceMethodDefaultOptions.getById)
    if (options.checkExistence.group) await this.throwIfNotExists({ _id: groupId })
    return (await this.groupModel.findById(groupId, undefined, queryOptions).exec()) as unknown as DocumentType<GroupModel>
  }

  async getByGroupIds(groupIds: Types.ObjectId[], queryOptions?: QueryOptions, options = groupServiceMethodDefaultOptions.getByGroupIds) {
    options = mergeOptionsWithDefaultOptions(options, groupServiceMethodDefaultOptions.getByGroupIds)
    if (options.checkExistence.group) await this.throwIfNotExists(groupIds.map(id => ({ _id: id })))
    const filter: FilterQuery<DocumentType<GroupModel>> = { _id: { $in: groupIds } }
    return this.groupModel.find(filter, undefined, queryOptions)
  }

  getMany(page: number, count: number, title?: string, queryOptions?: QueryOptions) {
    const filter: FilterQuery<DocumentType<GroupModel>> = {}
    if (title) filter.title = { $regex: title, $options: 'i' }
    return this.groupModel
      .find(filter, undefined, queryOptions)
      .skip((page - 1) * count)
      .limit(count)
      .exec()
  }

  countMany(title?: string) {
    const filter: FilterQuery<DocumentType<GroupModel>> = {}
    if (title) filter.title = { $regex: title, $options: 'i' }
    return this.groupModel.countDocuments(filter).exec()
  }

  async getByFacultyId(facultyId: Types.ObjectId, queryOptions?: QueryOptions, options = groupServiceMethodDefaultOptions.getByFacultyId) {
    options = mergeOptionsWithDefaultOptions(options, groupServiceMethodDefaultOptions.getByFacultyId)
    if (options.checkExistence.faculty) await this.facultyService.throwIfNotExists({ _id: facultyId })
    return this.groupModel.find({ faculty: facultyId }, undefined, queryOptions).exec()
  }

  async update(dto: UpdateGroupDto, options = groupServiceMethodDefaultOptions.update) {
    options = mergeOptionsWithDefaultOptions(options, groupServiceMethodDefaultOptions.update)
    if (options.checkExistence.groupById) await this.throwIfNotExists({ _id: dto.id })
    const group = await this.getById(dto.id, { projection: { faculty: 1, title: 1 } }, { checkExistence: { group: false } })
    if (options.checkExistence.groupByTitleAndFaculty && (dto.title || dto.faculty))
      await this.throwIfExists(
        { _id: { $ne: dto.id }, title: dto.title ?? group.title, faculty: dto.faculty ?? group.faculty },
        { error: GROUP_WITH_TITLE_EXISTS(dto.title ?? group.title) }
      )
    if (dto.faculty && options.checkExistence.faculty) await this.facultyService.throwIfNotExists({ _id: dto.faculty })
    if (dto.callSchedule && options.checkExistence.callSchedule) await this.callScheduleService.throwIfNotExists({ _id: dto.callSchedule })
    const { id, ...fields } = dto
    return this.groupModel.updateOne({ _id: id }, { $set: fields }).exec()
  }

  async updateLastScheduleUpdate(id: Types.ObjectId, date: Date, options = groupServiceMethodDefaultOptions.updateLastScheduleUpdate) {
    options = mergeOptionsWithDefaultOptions(options, groupServiceMethodDefaultOptions.updateLastScheduleUpdate)
    if (options.checkExistence.group) await this.throwIfNotExists({ _id: id })
    return this.groupModel.updateOne({ _id: id }, { $set: { lastScheduleUpdate: date } })
  }

  async delete(id: Types.ObjectId, options = groupServiceMethodDefaultOptions.delete) {
    options = mergeOptionsWithDefaultOptions(options, groupServiceMethodDefaultOptions.delete)
    if (options.checkExistence.group) await this.throwIfNotExists({ _id: id })
    await this.scheduleService.deleteByGroupId(id, { checkExistence: { group: false } })
    return this.groupModel.deleteOne({ _id: id })
  }

  async deleteAllByFacultyId(facultyId: Types.ObjectId, options = groupServiceMethodDefaultOptions.deleteAllByFacultyId) {
    options = mergeOptionsWithDefaultOptions(options, groupServiceMethodDefaultOptions.deleteAllByFacultyId)
    if (options.checkExistence.faculty) await this.facultyService.throwIfNotExists({ _id: facultyId })
    const groups = await this.getByFacultyId(facultyId, { projection: { _id: 1 } }, { checkExistence: { faculty: false } })
    await this.scheduleService.deleteAllByGroupIds(
      groups.map(g => g._id),
      { checkExistence: { groups: false } }
    )
    return this.groupModel.deleteMany({ faculty: facultyId })
  }
}
