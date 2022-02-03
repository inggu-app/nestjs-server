import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { NoteService } from './note.service'
import { CreateNoteDto } from './dto/createNoteDto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import { NoteGetQueryParametersEnum, NoteRoutesEnum } from './note.constants'
import { QueryOptions, Types } from 'mongoose'
import { DeviceId } from '../../global/types'
import { INVALID_NOTE_DEVICE_ID } from '../../global/constants/errors.constants'
import { CustomParseStringPipe } from '../../global/pipes/string.pipe'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'

@Controller()
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UsePipes(new ValidationPipe())
  @Post(NoteRoutesEnum.CREATE)
  create(@Body() dto: CreateNoteDto) {
    return this.noteService.create(dto)
  }

  @Get(NoteRoutesEnum.GET_BY_NOTE_ID)
  async getByNoteId(@MongoId(NoteGetQueryParametersEnum.NOTE_ID) noteId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.noteService.getById(noteId, queryOptions)
  }

  @Get(NoteRoutesEnum.GET_BY_LESSON_ID)
  async getByLessonId(
    @MongoId(NoteGetQueryParametersEnum.LESSON_ID) lessonId: Types.ObjectId,
    @Query(NoteGetQueryParametersEnum.WEEK, new CustomParseIntPipe()) week: number,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return this.noteService.get(lessonId, week, queryOptions)
  }

  @Delete(NoteRoutesEnum.DELETE)
  async delete(@MongoId('noteId') noteId: Types.ObjectId, @Query('deviceId', new CustomParseStringPipe()) deviceId: DeviceId) {
    const candidate = await this.noteService.getById(noteId)

    if (deviceId !== candidate.deviceId) {
      throw new HttpException(INVALID_NOTE_DEVICE_ID(noteId, deviceId), HttpStatus.BAD_REQUEST)
    }

    return this.noteService.delete(noteId)
  }
}
