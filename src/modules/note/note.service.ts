import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { NoteModel } from './note.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateNoteDto } from './dto/createNoteDto'
import { Types } from 'mongoose'
import { NoteField } from './note.constants'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { NOTE_WITH_ID_NOT_FOUND } from '../../global/constants/errors.constants'
import { ScheduleService } from '../schedule/schedule.service'

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(NoteModel) private readonly noteModel: ModelType<NoteModel>,
    private readonly scheduleService: ScheduleService
  ) {}

  async create(dto: CreateNoteDto) {
    await this.scheduleService.getById(dto.lesson)

    return this.noteModel.create(dto)
  }

  async get(lesson: Types.ObjectId, week: number, fields?: NoteField[]) {
    await this.scheduleService.getById(lesson)

    return this.noteModel.find({ lesson, week }, fieldsArrayToProjection(fields))
  }

  async getById(id: Types.ObjectId, fields?: NoteField[]) {
    const candidate = await this.noteModel.findById(id, fieldsArrayToProjection(fields))

    if (!candidate) {
      throw new HttpException(NOTE_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  delete(id: Types.ObjectId) {
    return this.noteModel.findByIdAndDelete(id)
  }
}