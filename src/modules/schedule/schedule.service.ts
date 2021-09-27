import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateScheduleDto } from './dto/create-schedule.dto'
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

  get(groupId: Types.ObjectId, fields?: ScheduleField[]) {
    return this.lessonModel.find({ group: groupId }, fieldsArrayToProjection(fields, ['number']))
  }

  async getById(id: Types.ObjectId, fields?: ScheduleField[]) {
    const candidate = await this.lessonModel.findById(id, fieldsArrayToProjection(fields))

    if (!candidate) {
      throw new HttpException(LESSON_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async delete(group: Types.ObjectId) {
    await this.lessonModel.deleteMany({ group })
  }
}
