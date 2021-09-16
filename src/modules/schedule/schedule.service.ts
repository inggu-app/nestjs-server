import { Injectable } from '@nestjs/common'
import { CreateScheduleDto } from './dto/create-schedule.dto'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { LessonModel } from './lesson.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import fieldsArrayToProjection from '../../global/utils/fieldsToProjection'
import { ScheduleField } from './schedule.constants'
import { Projection } from '../../global/pipes/fields.pipe'

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(LessonModel) private readonly lessonModel: ModelType<LessonModel, LessonModel>
  ) {}

  async create(dto: CreateScheduleDto) {
    const lessons = dto.schedule.map(lesson => ({ ...lesson, group: dto.group }))
    return this.lessonModel.create(lessons)
  }

  get(groupId: Types.ObjectId, fields?: Projection<ScheduleField>) {
    return this.lessonModel.find({ group: groupId }, fieldsArrayToProjection(fields, ['number']))
  }

  async delete(group: Types.ObjectId) {
    await this.lessonModel.deleteMany({ group })
  }
}
