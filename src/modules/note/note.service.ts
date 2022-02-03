import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { NoteModel } from './note.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateNoteDto } from './dto/createNoteDto'
import { QueryOptions, Types } from 'mongoose'
import { NOTE_WITH_ID_NOT_FOUND } from '../../global/constants/errors.constants'
import { ScheduleService } from '../schedule/schedule.service'
import { CheckExistenceService } from '../../global/classes/CheckExistenceService'
import { DocumentType } from '@typegoose/typegoose'

@Injectable()
export class NoteService extends CheckExistenceService<NoteModel> {
  constructor(@InjectModel(NoteModel) private readonly noteModel: ModelType<NoteModel>, private readonly scheduleService: ScheduleService) {
    super(noteModel, undefined, note => NOTE_WITH_ID_NOT_FOUND(note._id))
  }

  async create(dto: CreateNoteDto) {
    await this.scheduleService.throwIfNotExists({ _id: Types.ObjectId(dto.lesson) })
    return this.noteModel.create(dto)
  }

  async get(lesson: Types.ObjectId, week: number, queryOptions?: QueryOptions) {
    await this.scheduleService.throwIfNotExists({ _id: lesson })
    return this.noteModel.find({ lesson, week }, undefined, queryOptions).exec()
  }

  async getById(id: Types.ObjectId, queryOptions?: QueryOptions) {
    await this.throwIfNotExists({ _id: id })
    return (await this.noteModel.findById(id, undefined, queryOptions).exec()) as unknown as DocumentType<NoteModel>
  }

  async delete(id: Types.ObjectId) {
    await this.throwIfNotExists({ _id: id })
    return this.noteModel.deleteOne({ _id: id })
  }
}
