import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { NoteModel } from './note.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateNoteDto } from './dto/createNoteDto'
import { Error, QueryOptions, Types } from 'mongoose'
import { NoteFieldsEnum } from './note.constants'
import { NOTE_WITH_ID_NOT_FOUND } from '../../global/constants/errors.constants'
import { ScheduleService } from '../schedule/schedule.service'
import { ModelBase, MongoIdString, ObjectByInterface } from '../../global/types'
import { stringToObjectId } from '../../global/utils/stringToObjectId'

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(NoteModel) private readonly noteModel: ModelType<NoteModel>,
    private readonly scheduleService: ScheduleService
  ) {}

  async create(dto: CreateNoteDto) {
    await this.scheduleService.checkExists({ _id: dto.lesson })

    return this.noteModel.create(dto)
  }

  async get(lesson: Types.ObjectId | MongoIdString, week: number, queryOptions?: QueryOptions) {
    await this.scheduleService.checkExists({ _id: lesson })

    return this.noteModel.find({ lesson, week }, undefined, queryOptions).exec()
  }

  async getById(id: Types.ObjectId | MongoIdString, queryOptions?: QueryOptions) {
    id = stringToObjectId(id)
    const candidate = await this.noteModel.findById(id, undefined, queryOptions).exec()

    if (!candidate) {
      throw new HttpException(NOTE_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async delete(id: Types.ObjectId | MongoIdString) {
    await this.checkExists({ _id: id })
    await this.noteModel.deleteOne({ _id: id })
    return
  }

  async checkExists(
    filter: ObjectByInterface<typeof NoteFieldsEnum, ModelBase> | ObjectByInterface<typeof NoteFieldsEnum, ModelBase>[],
    options?: { error?: ((filter: ObjectByInterface<typeof NoteFieldsEnum, ModelBase>) => Error) | Error; checkExisting?: boolean }
  ) {
    options = {
      error: f => new NotFoundException(NOTE_WITH_ID_NOT_FOUND(f._id)),
      checkExisting: true,
      ...options,
    }
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.noteModel.exists(f)

        if (!candidate && options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        } else if (candidate && !options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        }
      }
    } else {
      const candidate = await this.noteModel.exists(filter)

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
