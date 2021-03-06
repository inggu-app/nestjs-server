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
    const lessons = dto.schedule.map(lesson => ({ ...lesson, group: dto.group }))
    return this.lessonModel.create(lessons)
  }

  get(groupId: Types.ObjectId) {
    return this.lessonModel.find({ group: groupId }, { createdAt: 0, updatedAt: 0, group: 0 })
  }

  async delete(group: Types.ObjectId) {
    await this.lessonModel.deleteMany({ group })
  }
}
