import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateScheduleDto, Lesson } from './dto/createSchedule.dto'
import { Error, QueryOptions, Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { LessonModel } from './lesson.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { LessonFieldsEnum } from './schedule.constants'
import { LESSON_WITH_ID_NOT_FOUND } from '../../global/constants/errors.constants'
import { ModelBase, MongoIdString, ObjectByInterface } from '../../global/types'
import { stringToObjectId } from '../../global/utils/stringToObjectId'

@Injectable()
export class ScheduleService {
  constructor(@InjectModel(LessonModel) private readonly lessonModel: ModelType<LessonModel, LessonModel>) {}

  async create(dto: CreateScheduleDto) {
    const lessons = dto.schedule.map(lesson => ({ ...lesson, group: dto.group }))
    return this.lessonModel.create(lessons)
  }

  getByGroup(groupId: Types.ObjectId | MongoIdString, queryOptions?: QueryOptions) {
    groupId = stringToObjectId(groupId)
    return this.lessonModel.find({ group: groupId }, undefined, queryOptions).exec()
  }

  async getById(id: Types.ObjectId | MongoIdString, queryOptions?: QueryOptions) {
    id = stringToObjectId(id)
    const candidate = await this.lessonModel.findById(id, undefined, queryOptions).exec()

    if (!candidate) {
      throw new HttpException(LESSON_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async updateById(id: Types.ObjectId | MongoIdString, lesson: Lesson) {
    id = stringToObjectId(id)
    await this.checkExists({ _id: id })
    await this.lessonModel.updateOne({ _id: id }, { $set: { ...lesson } }).exec()

    return
  }

  async delete(groupId: Types.ObjectId | MongoIdString, ids?: Types.ObjectId[]) {
    groupId = stringToObjectId(groupId)
    if (!ids) {
      await this.lessonModel.deleteMany({ group: groupId })
    } else {
      await this.lessonModel.deleteMany({ group: groupId, _id: { $in: ids } })
    }
  }

  async checkExists(
    filter: ObjectByInterface<typeof LessonFieldsEnum, ModelBase> | ObjectByInterface<typeof LessonFieldsEnum, ModelBase>[],
    options?: { error?: ((filter: ObjectByInterface<typeof LessonFieldsEnum, ModelBase>) => Error) | Error; checkExisting?: boolean }
  ) {
    options = {
      error: f => new NotFoundException(LESSON_WITH_ID_NOT_FOUND(f._id)),
      checkExisting: true,
      ...options,
    }
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.lessonModel.exists(f)

        if (!candidate && options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        } else if (candidate && !options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        }
      }
    } else {
      const candidate = await this.lessonModel.exists(filter)

      if (!candidate && options.checkExisting) {
        if (typeof options.error === 'function') throw options.error(filter)
        throw options.error
      } else if (candidate && !options.checkExisting) {
        if (typeof options.error === 'function') throw options.error(filter)
        throw options.error
      }
    }

    return true
  }
}
