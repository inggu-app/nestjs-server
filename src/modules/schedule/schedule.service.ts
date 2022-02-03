import { Injectable } from '@nestjs/common'
import { CreateScheduleDto, Lesson } from './dto/createSchedule.dto'
import { FilterQuery, QueryOptions, Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { LessonModel } from './lesson.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { LESSON_WITH_ID_NOT_FOUND } from '../../global/constants/errors.constants'
import { CheckExistenceService } from '../../global/classes/CheckExistenceService'
import { GroupService } from '../group/group.service'
import { DocumentType } from '@typegoose/typegoose'

@Injectable()
export class ScheduleService extends CheckExistenceService<LessonModel> {
  constructor(
    @InjectModel(LessonModel) private readonly lessonModel: ModelType<LessonModel, LessonModel>,
    private readonly groupService: GroupService
  ) {
    super(lessonModel, undefined, lesson => LESSON_WITH_ID_NOT_FOUND(lesson._id))
  }

  async create(dto: CreateScheduleDto) {
    const lessons = dto.schedule.map(lesson => ({ ...lesson, group: dto.group }))
    return this.lessonModel.create(lessons)
  }

  getByGroup(groupId: Types.ObjectId, queryOptions?: QueryOptions) {
    return this.lessonModel.find({ group: groupId }, undefined, queryOptions).exec()
  }

  async getById(id: Types.ObjectId, queryOptions?: QueryOptions) {
    await this.throwIfNotExists({ _id: id })
    return this.lessonModel.findById(id, undefined, queryOptions).exec()
  }

  async updateById(id: Types.ObjectId, lesson: Lesson) {
    await this.throwIfNotExists({ _id: id })
    return this.lessonModel.updateOne({ _id: id }, { $set: { ...lesson } }).exec()
  }

  async delete(groupId: Types.ObjectId, ids?: Types.ObjectId[]) {
    await this.groupService.throwIfNotExists({ _id: groupId })
    const filter: FilterQuery<DocumentType<LessonModel>> = { group: groupId }
    if (ids) filter._id = { $in: ids }

    return this.lessonModel.deleteMany(filter)
  }
}
