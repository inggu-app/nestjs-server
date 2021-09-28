import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateScheduleDto, Lesson } from './dto/createSchedule.dto'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { LessonModel } from './lesson.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { ScheduleField } from './schedule.constants'
import { LESSON_WITH_ID_NOT_FOUND } from '../../global/constants/errors.constants'

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(LessonModel) private readonly lessonModel: ModelType<LessonModel, LessonModel>
  ) {}

  async create(dto: CreateScheduleDto) {
    const lessons = dto.schedule.map(lesson => ({ ...lesson, group: dto.group }))
    return this.lessonModel.create(lessons)
  }

  getByGroup(groupId: Types.ObjectId, fields?: ScheduleField[]) {
    return this.lessonModel
      .find({ group: groupId }, fieldsArrayToProjection(fields, ['number']))
      .exec()
  }

  async getById(id: Types.ObjectId, fields?: ScheduleField[]) {
    const candidate = await this.lessonModel.findById(id, fieldsArrayToProjection(fields)).exec()

    if (!candidate) {
      throw new HttpException(LESSON_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async updateById(id: Types.ObjectId, lesson: Lesson) {
    const candidate = await this.lessonModel
      .findOneAndUpdate({ _id: id }, { $set: { ...lesson } })
      .exec()

    if (!candidate) {
      throw new HttpException(LESSON_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async delete(group: Types.ObjectId, ids?: Types.ObjectId[]) {
    await this.lessonModel.deleteMany(ids ? { group, _id: { $in: ids } } : { group }).exec()
  }
}
