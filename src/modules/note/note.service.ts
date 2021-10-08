import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { NoteModel } from './note.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateNoteDto } from './dto/createNoteDto'
import { Error, Types } from 'mongoose'
import { NoteField, NoteFieldsEnum } from './note.constants'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { NOTE_WITH_ID_NOT_FOUND } from '../../global/constants/errors.constants'
import { ScheduleService } from '../schedule/schedule.service'
import { ModelBase, ObjectByInterface } from '../../global/types'

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

  async get(lesson: Types.ObjectId, week: number, fields?: NoteField[]) {
    await this.scheduleService.checkExists({ _id: lesson })

    return this.noteModel.find({ lesson, week }, fieldsArrayToProjection(fields)).exec()
  }

  async getById(id: Types.ObjectId, fields?: NoteField[]) {
    const candidate = await this.noteModel.findById(id, fieldsArrayToProjection(fields)).exec()

    if (!candidate) {
      throw new HttpException(NOTE_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async delete(id: Types.ObjectId) {
    await this.checkExists({ _id: id })
    return this.noteModel.findByIdAndDelete(id).exec()
  }

  async checkExists(
    filter: ObjectByInterface<typeof NoteFieldsEnum, ModelBase> | ObjectByInterface<typeof NoteFieldsEnum, ModelBase>[],
    error: ((filter: ObjectByInterface<typeof NoteFieldsEnum, ModelBase>) => Error) | Error = f =>
      new NotFoundException(NOTE_WITH_ID_NOT_FOUND(f._id))
  ) {
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.noteModel.exists(f)

        if (!candidate) {
          if (error instanceof Error) throw Error
          throw error(f)
        }
      }
    } else {
      if (!(await this.noteModel.exists(filter))) {
        if (error instanceof Error) throw error
        throw error(filter)
      }
    }

    return true
  }
}
