import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateScheduleDto, Lesson } from './dto/createSchedule.dto'
import { Error, Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { LessonModel } from './lesson.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { LessonFieldsEnum, ScheduleField } from './schedule.constants'
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

  getByGroup(groupId: Types.ObjectId | MongoIdString, fields?: ScheduleField[]) {
    groupId = stringToObjectId(groupId)
    return this.lessonModel.find({ group: groupId }, fieldsArrayToProjection(fields, ['number'])).exec()
  }

  async getById(id: Types.ObjectId | MongoIdString, fields?: ScheduleField[]) {
    id = stringToObjectId(id)
    const candidate = await this.lessonModel.findById(id, fieldsArrayToProjection(fields)).exec()

    if (!candidate) {
      throw new HttpException(LESSON_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async updateById(id: Types.ObjectId, lesson: Lesson) {
    await this.checkExists({ _id: id })
    await this.lessonModel.updateOne({ _id: id }, { $set: { ...lesson } }).exec()

    return
  }

  async delete(group: Types.ObjectId, ids?: Types.ObjectId[]) {
    await this.lessonModel.deleteMany(ids ? { group, _id: { $in: ids } } : { group }).exec()
  }

  async checkExists(
    filter: ObjectByInterface<typeof LessonFieldsEnum, ModelBase> | ObjectByInterface<typeof LessonFieldsEnum, ModelBase>[],
    error: ((filter: ObjectByInterface<typeof LessonFieldsEnum, ModelBase>) => Error) | Error = f =>
      new NotFoundException(LESSON_WITH_ID_NOT_FOUND(f._id))
  ) {
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.lessonModel.exists(f)

        if (!candidate) {
          if (error instanceof Error) throw Error
          throw error(f)
        }
      }
    } else {
      if (!(await this.lessonModel.exists(filter))) {
        if (error instanceof Error) throw error
        throw error(filter)
      }
    }

    return true
  }
}
