import { Injectable } from '@nestjs/common'
import { CreateScheduleDto } from './dto/create-schedule.dto'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { LessonModel } from './lesson.model'
import { ModelType } from '@typegoose/typegoose/lib/types'

@Injectable()
export class ScheduleService {
  constructor(@InjectModel(LessonModel) private readonly lessonModel: ModelType<LessonModel>) {}

  async create(dto: CreateScheduleDto) {
    await this.lessonModel.deleteMany({ group: dto.group })

    const lessons = dto.schedule.map(lesson => ({ ...lesson, group: dto.group }))
    return this.lessonModel.create(lessons)
  }

  get(groupId: Types.ObjectId) {
    return this.lessonModel.find({ group: groupId })
  }
}
