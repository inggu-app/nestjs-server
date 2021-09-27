import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { NoteService } from './note.service'
import { CreateNoteDto } from './dto/createNoteDto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import { ParseFieldsPipe } from '../../global/pipes/fields.pipe'
import {
  GetNotesEnum,
  NoteAdditionalFieldsEnum,
  NoteField,
  NoteFieldsEnum,
  NoteForbiddenFieldsEnum,
} from './note.constants'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { DeviceId } from '../../global/types'
import { INVALID_NOTE_DEVICE_ID } from '../../global/constants/errors.constants'
import { CustomParseStringPipe } from '../../global/pipes/string.pipe'

@Controller()
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UsePipes(new ValidationPipe())
  @Post('/')
  create(@Body() dto: CreateNoteDto) {
    return this.noteService.create(dto)
  }

  @Get('/')
  get(
    @Query('noteId', new ParseMongoIdPipe({ required: false })) noteId?: Types.ObjectId,
    @Query('lessonId', new ParseMongoIdPipe({ required: false })) lessonId?: Types.ObjectId,
    @Query('week', new CustomParseIntPipe({ required: false })) week?: number,
    @Query(
      'fields',
      new ParseFieldsPipe({
        fieldsEnum: NoteFieldsEnum,
        additionalFieldsEnum: NoteAdditionalFieldsEnum,
        forbiddenFieldsEnum: NoteForbiddenFieldsEnum,
      })
    )
    fields?: NoteField[]
  ) {
    const request = checkAlternativeQueryParameters<GetNotesEnum>(
      {
        required: { lessonId, week },
        fields,
        enum: GetNotesEnum.BY_LESSON,
      },
      { required: { noteId }, fields, enum: GetNotesEnum.BY_ID }
    )

    switch (request.enum) {
      case GetNotesEnum.BY_LESSON:
        return this.noteService.get(request.lessonId, request.week, request.fields)
      case GetNotesEnum.BY_ID:
        return this.noteService.getById(request.noteId, request.fields)
    }
  }

  @Delete('/')
  async delete(
    @Query('id', new ParseMongoIdPipe()) id: Types.ObjectId,
    @Query('deviceId', new CustomParseStringPipe()) deviceId: DeviceId
  ) {
    const candidate = await this.noteService.getById(id)

    console.log(candidate, deviceId)
    if (deviceId !== candidate.deviceId) {
      throw new HttpException(INVALID_NOTE_DEVICE_ID(id, deviceId), HttpStatus.BAD_REQUEST)
    }

    return this.noteService.delete(id)
  }
}
