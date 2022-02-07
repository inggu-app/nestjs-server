import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post } from '@nestjs/common'
import { NoteService } from './note.service'
import { CreateNoteDto } from './dto/createNoteDto'
import { QueryOptions, Types } from 'mongoose'
import { DeviceId } from '../../global/types'
import { INVALID_NOTE_DEVICE_ID } from '../../global/constants/errors.constants'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'
import { IntQueryParam } from '../../global/decorators/IntQueryParam.decorator'
import { StringQueryParam } from '../../global/decorators/StringQueryParam.decorator'

@Controller()
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @WhitelistedValidationPipe()
  @Post('/')
  create(@Body() dto: CreateNoteDto) {
    return this.noteService.create(dto)
  }

  @Get('/by-id')
  async getById(@MongoId('noteId') noteId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.noteService.getById(noteId, queryOptions)
  }

  @Get('/by-lesson-id')
  async getByLessonId(
    @MongoId('lessonId') lessonId: Types.ObjectId,
    @IntQueryParam('week', { intType: 'positive' }) week: number,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      notes: await this.noteService.get(lessonId, week, queryOptions),
    }
  }

  @Delete('/')
  async delete(@MongoId('noteId') noteId: Types.ObjectId, @StringQueryParam('deviceId', { required: false }) deviceId: DeviceId) {
    const candidate = await this.noteService.getById(noteId)

    if (deviceId !== candidate.deviceId) {
      throw new HttpException(INVALID_NOTE_DEVICE_ID(noteId, deviceId), HttpStatus.BAD_REQUEST)
    }

    await this.noteService.delete(noteId)
  }
}
