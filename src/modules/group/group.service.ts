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

  async create(dto: CreateGroupDto) {
    await this.throwIfExists({ title: dto.title, faculty: Types.ObjectId(dto.faculty) }, { error: GROUP_WITH_TITLE_EXISTS(dto.title) })
    await this.facultyService.throwIfNotExists({ _id: Types.ObjectId(dto.faculty) })
    if (dto.callSchedule) await this.callScheduleService.throwIfNotExists({ _id: Types.ObjectId(dto.callSchedule) })
    return this.groupModel.create(dto)
  }

  async getById(groupId: Types.ObjectId, queryOptions?: QueryOptions) {
    await this.throwIfNotExists({ _id: groupId })
    return (await this.groupModel.findById(groupId, undefined, queryOptions).exec()) as unknown as DocumentType<GroupModel>
  }

  async getByGroupIds(groupIds: Types.ObjectId[], queryOptions?: QueryOptions) {
    await this.throwIfNotExists(groupIds.map(id => ({ _id: id })))
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

  async getByFacultyId(facultyId: Types.ObjectId, queryOptions?: QueryOptions) {
    await this.facultyService.throwIfNotExists({ _id: facultyId })
    return this.groupModel.find({ faculty: facultyId }, undefined, queryOptions).exec()
  }

  async update(dto: UpdateGroupDto) {
    await this.throwIfNotExists({ _id: Types.ObjectId(dto.id) })
    const group = await this.getById(Types.ObjectId(dto.id), { projection: { faculty: 1 } })
    await this.throwIfExists(
      { title: dto.title, faculty: dto.faculty ? Types.ObjectId(dto.faculty) : group.faculty },
      { error: GROUP_WITH_TITLE_EXISTS(dto.title) }
    )
    if (dto.faculty) await this.facultyService.throwIfNotExists({ _id: Types.ObjectId(dto.faculty) })
    if (dto.callSchedule) await this.callScheduleService.throwIfNotExists({ _id: Types.ObjectId(dto.callSchedule) })
    const { id, ...fields } = dto
    return this.groupModel.updateOne({ _id: id }, { $set: fields }).exec()
  }

  async delete(id: Types.ObjectId) {
    await this.throwIfNotExists({ _id: id })
    await this.scheduleService.deleteByGroupId(id)
    return this.groupModel.deleteOne({ _id: id })
  }

  async deleteAllByFacultyId(facultyId: Types.ObjectId) {
    await this.facultyService.throwIfNotExists({ _id: facultyId })
    const groups = await this.getByFacultyId(facultyId, { projection: { _id: 1 } })
    await this.scheduleService.deleteAllByGroupIds(groups.map(g => g._id))
    return this.groupModel.deleteMany({ faculty: facultyId })
  }
}
