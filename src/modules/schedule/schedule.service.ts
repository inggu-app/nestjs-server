import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CreateScheduleDto, Lesson } from './dto/createSchedule.dto'
import { QueryOptions, Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { LessonModel } from './lesson.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { LESSON_WITH_ID_NOT_FOUND } from '../../global/constants/errors.constants'
import { CheckExistenceService } from '../../global/classes/CheckExistenceService'
import { DocumentType } from '@typegoose/typegoose'
import { GroupService } from '../group/services/group.service'
import { NoteService } from '../note/note.service'
import { scheduleServiceMethodDefaultOptions } from './schedule.constants'
import { mergeOptionsWithDefaultOptions } from '../../global/utils/serviceMethodOptions'

@Injectable()
export class ScheduleService extends CheckExistenceService<LessonModel> {
  constructor(
    @InjectModel(LessonModel) private readonly lessonModel: ModelType<LessonModel, LessonModel>,
    @Inject(forwardRef(() => GroupService)) private readonly groupService: GroupService,
    private readonly noteService: NoteService
  ) {
    super(lessonModel, undefined, lesson => LESSON_WITH_ID_NOT_FOUND(lesson._id))
  }

  async create(dto: CreateScheduleDto, options = scheduleServiceMethodDefaultOptions.create) {
    options = mergeOptionsWithDefaultOptions(options, scheduleServiceMethodDefaultOptions.create)
    if (options.checkExistence.group) await this.groupService.throwIfNotExists({ _id: dto.group })
    const lessons = dto.schedule.map(lesson => ({ ...lesson, group: dto.group }))
    return this.lessonModel.create(lessons)
  }

  async getByGroupId(groupId: Types.ObjectId, queryOptions?: QueryOptions, options = scheduleServiceMethodDefaultOptions.getByGroupId) {
    options = mergeOptionsWithDefaultOptions(options, scheduleServiceMethodDefaultOptions.getByGroupId)
    if (options.checkExistence.group) await this.groupService.throwIfNotExists({ _id: groupId })
    return this.lessonModel.find({ group: groupId }, undefined, queryOptions)
  }

  async getByGroupIds(
    groupIds: Types.ObjectId[],
    queryOptions?: QueryOptions,
    options = scheduleServiceMethodDefaultOptions.getByGroupIds
  ) {
    options = mergeOptionsWithDefaultOptions(options, scheduleServiceMethodDefaultOptions.getByGroupIds)
    if (options.checkExistence.groups) await this.groupService.throwIfNotExists(groupIds.map(id => ({ _id: id })))
    return this.lessonModel.find({ group: { $in: groupIds } }, undefined, queryOptions)
  }

  async getById(id: Types.ObjectId, queryOptions?: QueryOptions, options = scheduleServiceMethodDefaultOptions.getById) {
    options = mergeOptionsWithDefaultOptions(options, scheduleServiceMethodDefaultOptions.getById)
    if (options.checkExistence.schedule) await this.throwIfNotExists({ _id: id })
    return (await this.lessonModel.findById(id, undefined, queryOptions).exec()) as unknown as DocumentType<LessonModel>
  }

  async updateById(id: Types.ObjectId, lesson: Lesson, options = scheduleServiceMethodDefaultOptions.updateById) {
    options = mergeOptionsWithDefaultOptions(options, scheduleServiceMethodDefaultOptions.updateById)
    if (options.checkExistence.schedule) await this.throwIfNotExists({ _id: id })
    return this.lessonModel.updateOne({ _id: id }, { $set: { ...lesson } }).exec()
  }

  async deleteByGroupId(groupId: Types.ObjectId, options = scheduleServiceMethodDefaultOptions.deleteByGroupId) {
    options = mergeOptionsWithDefaultOptions(options, scheduleServiceMethodDefaultOptions.deleteByGroupId)
    if (options.checkExistence.group) await this.groupService.throwIfNotExists({ _id: groupId })
    const lessons = await this.getByGroupId(groupId, { projection: { _id: 1 } }, { checkExistence: { group: false } })
    await this.noteService.deleteAllByLessonIds(
      lessons.map(lesson => lesson._id),
      { checkExistence: { lessons: false } }
    )
    return this.lessonModel.deleteMany({ group: groupId })
  }

  async deleteAllByGroupIds(groupIds: Types.ObjectId[], options = scheduleServiceMethodDefaultOptions.deleteAllByGroupIds) {
    options = mergeOptionsWithDefaultOptions(options, scheduleServiceMethodDefaultOptions.deleteAllByGroupIds)
    if (options.checkExistence.groups) await this.groupService.throwIfNotExists(groupIds.map(id => ({ _id: id })))
    const lessons = await this.getByGroupIds(groupIds, { projection: { _id: 1 } }, { checkExistence: { groups: false } })
    await this.noteService.deleteAllByLessonIds(
      lessons.map(lesson => lesson._id),
      { checkExistence: { lessons: false } }
    )
    return this.lessonModel.deleteMany({ group: { $in: groupIds } })
  }

  async deleteMany(ids: Types.ObjectId[], options = scheduleServiceMethodDefaultOptions.deleteMany) {
    options = mergeOptionsWithDefaultOptions(options, scheduleServiceMethodDefaultOptions.deleteMany)
    if (options.checkExistence.schedule) await this.throwIfNotExists(ids.map(id => ({ _id: id })))
    await this.noteService.deleteAllByLessonIds(ids, { checkExistence: { lessons: false } })
    return this.lessonModel.deleteMany({ _id: { $in: ids } })
  }
}
