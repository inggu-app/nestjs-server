import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { NoteModel } from './note.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateNoteDto } from './dto/createNoteDto'
import { QueryOptions, Types } from 'mongoose'
import { NOTE_WITH_ID_NOT_FOUND } from '../../global/constants/errors.constants'
import { ScheduleService } from '../schedule/schedule.service'
import { CheckExistenceService } from '../../global/classes/CheckExistenceService'
import { DocumentType } from '@typegoose/typegoose'
import { noteServiceMethodDefaultOptions } from './note.constants'
import { mergeOptionsWithDefaultOptions } from '../../global/utils/serviceMethodOptions'

@Injectable()
export class NoteService extends CheckExistenceService<NoteModel> {
  constructor(
    @InjectModel(NoteModel) private readonly noteModel: ModelType<NoteModel>,
    @Inject(forwardRef(() => ScheduleService)) private readonly scheduleService: ScheduleService
  ) {
    super(noteModel, undefined, note => NOTE_WITH_ID_NOT_FOUND(note._id))
  }

  async create(dto: CreateNoteDto, options = noteServiceMethodDefaultOptions.create) {
    options = mergeOptionsWithDefaultOptions(options, noteServiceMethodDefaultOptions.create)
    if (options.checkExistence.note) await this.scheduleService.throwIfNotExists({ _id: Types.ObjectId(dto.lesson) })
    return this.noteModel.create(dto)
  }

  async get(lesson: Types.ObjectId, week: number, queryOptions?: QueryOptions, options = noteServiceMethodDefaultOptions.get) {
    options = mergeOptionsWithDefaultOptions(options, noteServiceMethodDefaultOptions.get)
    if (options.checkExistence.note) await this.scheduleService.throwIfNotExists({ _id: lesson })
    return this.noteModel.find({ lesson, week }, undefined, queryOptions).exec()
  }

  async getById(id: Types.ObjectId, queryOptions?: QueryOptions, options = noteServiceMethodDefaultOptions.getById) {
    options = mergeOptionsWithDefaultOptions(options, noteServiceMethodDefaultOptions.getById)
    if (options.checkExistence.note) await this.throwIfNotExists({ _id: id })
    return (await this.noteModel.findById(id, undefined, queryOptions).exec()) as unknown as DocumentType<NoteModel>
  }

  async delete(id: Types.ObjectId, options = noteServiceMethodDefaultOptions.delete) {
    options = mergeOptionsWithDefaultOptions(options, noteServiceMethodDefaultOptions.delete)
    if (options.checkExistence.note) await this.throwIfNotExists({ _id: id })
    return this.noteModel.deleteOne({ _id: id })
  }

  async deleteAllByLessonIds(lessonIds: Types.ObjectId[], options = noteServiceMethodDefaultOptions.deleteAllByLessonIds) {
    options = mergeOptionsWithDefaultOptions(options, noteServiceMethodDefaultOptions.deleteAllByLessonIds)
    if (options.checkExistence.note) await this.scheduleService.throwIfNotExists(lessonIds.map(id => ({ _id: id })))
    return this.noteModel.deleteMany({ lesson: { $in: lessonIds } })
  }

  async deleteByLessonId(lessonId: Types.ObjectId, options = noteServiceMethodDefaultOptions.deleteAllByLessonIds) {
    options = mergeOptionsWithDefaultOptions(options, noteServiceMethodDefaultOptions.deleteByLessonId)
    if (options.checkExistence.note) await this.scheduleService.throwIfNotExists({ _id: lessonId })
    return this.noteModel.deleteOne({ _id: lessonId })
  }
}
