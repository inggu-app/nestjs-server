import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { NoteService } from './note.service'
import { CreateNoteDto } from './dto/createNoteDto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import {
  NoteAdditionalFieldsEnum,
  NoteField,
  NoteFieldsEnum,
  NoteForbiddenFieldsEnum,
  NoteGetQueryParametersEnum,
  NoteRoutesEnum,
} from './note.constants'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { DeviceId } from '../../global/types'
import { INVALID_NOTE_DEVICE_ID } from '../../global/constants/errors.constants'
import { CustomParseStringPipe } from '../../global/pipes/string.pipe'
import normalizeFields from '../../global/utils/normalizeFields'
import { Fields } from '../../global/decorators/Fields.decorator'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'

@Controller()
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.NOTE__CREATE,
    title: 'Создать заметку',
  })
  @Post(NoteRoutesEnum.CREATE)
  create(@Body() dto: CreateNoteDto) {
    return this.noteService.create(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.NOTE__GET_BY_NOTE_ID,
    title: 'Получить заметку по id',
  })
  @Get(NoteRoutesEnum.GET_BY_NOTE_ID)
  async getByNoteId(
    @Query(NoteGetQueryParametersEnum.NOTE_ID, new ParseMongoIdPipe()) noteId: Types.ObjectId,
    @Fields({ fieldsEnum: NoteFieldsEnum, additionalFieldsEnum: NoteAdditionalFieldsEnum, forbiddenFieldsEnum: NoteForbiddenFieldsEnum })
    fields?: NoteField[]
  ) {
    return normalizeFields(await this.noteService.getById(noteId, fields), {
      fields,
      forbiddenFields: NoteForbiddenFieldsEnum,
    })
  }

  @Functionality({
    code: FunctionalityCodesEnum.NOTE__GET_BY_LESSON_ID,
    title: 'Получить заметки по id занятия и номеру недели',
  })
  @Get(NoteRoutesEnum.GET_BY_LESSON_ID)
  async getByLessonId(
    @Query(NoteGetQueryParametersEnum.LESSON_ID, new ParseMongoIdPipe()) lessonId: Types.ObjectId,
    @Query(NoteGetQueryParametersEnum.WEEK, new CustomParseIntPipe()) week: number,
    @Fields({ fieldsEnum: NoteFieldsEnum, additionalFieldsEnum: NoteAdditionalFieldsEnum, forbiddenFieldsEnum: NoteForbiddenFieldsEnum })
    fields?: NoteField[]
  ) {
    return normalizeFields(await this.noteService.get(lessonId, week, fields), { fields, forbiddenFields: NoteForbiddenFieldsEnum })
  }

  @Delete(NoteRoutesEnum.DELETE)
  async delete(
    @Query('id', new ParseMongoIdPipe()) id: Types.ObjectId,
    @Query('deviceId', new CustomParseStringPipe()) deviceId: DeviceId
  ) {
    const candidate = await this.noteService.getById(id, ['deviceId'])

    if (deviceId !== candidate.deviceId) {
      throw new HttpException(INVALID_NOTE_DEVICE_ID(id, deviceId), HttpStatus.BAD_REQUEST)
    }

    return this.noteService.delete(id)
  }
}
