import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { NoteService } from './note.service'
import { CreateNoteDto } from './dto/createNoteDto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import {
  defaultNoteCreateData,
  defaultNoteDeleteData,
  defaultNoteGetByLessonIdData,
  defaultNoteGetByNoteIdData,
  NoteAdditionalFieldsEnum,
  NoteField,
  NoteFieldsEnum,
  NoteForbiddenFieldsEnum,
  NoteGetQueryParametersEnum,
  NoteRoutesEnum,
} from './note.constants'
import { Types } from 'mongoose'
import { DeviceId } from '../../global/types'
import { INVALID_NOTE_DEVICE_ID } from '../../global/constants/errors.constants'
import { CustomParseStringPipe } from '../../global/pipes/string.pipe'
import normalizeFields from '../../global/utils/normalizeFields'
import { Fields } from '../../global/decorators/Fields.decorator'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { MongoId } from '../../global/decorators/MongoId.decorator'

@Controller()
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.NOTE__CREATE,
    default: defaultNoteCreateData,
    title: 'Создать заметку',
  })
  @Post(NoteRoutesEnum.CREATE)
  create(@Body() dto: CreateNoteDto) {
    return this.noteService.create(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.NOTE__GET_BY_NOTE_ID,
    default: defaultNoteGetByNoteIdData,
    title: 'Получить заметку по id',
  })
  @Get(NoteRoutesEnum.GET_BY_NOTE_ID)
  async getByNoteId(@MongoId(NoteGetQueryParametersEnum.NOTE_ID) noteId: Types.ObjectId, @GetNoteFields() fields?: NoteField[]) {
    return normalizeFields(await this.noteService.getById(noteId, fields), {
      fields,
      forbiddenFields: NoteForbiddenFieldsEnum,
    })
  }

  @Functionality({
    code: FunctionalityCodesEnum.NOTE__GET_BY_LESSON_ID,
    default: defaultNoteGetByLessonIdData,
    title: 'Получить заметки по id занятия и номеру недели',
  })
  @Get(NoteRoutesEnum.GET_BY_LESSON_ID)
  async getByLessonId(
    @MongoId(NoteGetQueryParametersEnum.LESSON_ID) lessonId: Types.ObjectId,
    @Query(NoteGetQueryParametersEnum.WEEK, new CustomParseIntPipe()) week: number,
    @GetNoteFields() fields?: NoteField[]
  ) {
    return normalizeFields(await this.noteService.get(lessonId, week, fields), { fields, forbiddenFields: NoteForbiddenFieldsEnum })
  }

  @Functionality({
    code: FunctionalityCodesEnum.NOTE__DELETE,
    default: defaultNoteDeleteData,
    title: 'Удалить заметку по id',
  })
  @Delete(NoteRoutesEnum.DELETE)
  async delete(@MongoId('noteId') noteId: Types.ObjectId, @Query('deviceId', new CustomParseStringPipe()) deviceId: DeviceId) {
    const candidate = await this.noteService.getById(noteId, ['deviceId'])

    if (deviceId !== candidate.deviceId) {
      throw new HttpException(INVALID_NOTE_DEVICE_ID(noteId, deviceId), HttpStatus.BAD_REQUEST)
    }

    return this.noteService.delete(noteId)
  }
}

function GetNoteFields() {
  return Fields({
    fieldsEnum: NoteFieldsEnum,
    additionalFieldsEnum: NoteAdditionalFieldsEnum,
    forbiddenFieldsEnum: NoteForbiddenFieldsEnum,
  })
}
