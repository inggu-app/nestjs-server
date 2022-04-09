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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiResponseException } from '../../global/decorators/ApiResponseException.decorator'
import { NoteModuleCreateResponseDto } from './dto/responses/NoteModuleCreateResponse.dto'
import { MongoIdExample, MongoIdType } from '../../global/constants/constants'
import { ApiMongoQueryOptions } from '../../global/decorators/ApiMongoQueryOptions.decorator'
import { NoteModuleGetByIdResponseDto } from './dto/responses/NoteModuleGetByIdResponse.dto'
import { NoteModuleGetByLessonIdResponseDto } from './dto/responses/NoteModuleGetByLessonIdResponse.dto'
import { NoteModel } from './note.model'

@ApiTags('Заметки')
@Controller()
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет создать заметку',
  })
  @ApiResponseException()
  @ApiResponse({
    type: NoteModuleCreateResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post('/')
  async create(@Body() dto: CreateNoteDto) {
    return {
      note: await this.noteService.create(dto),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить заметку по id',
  })
  @ApiQuery({
    name: 'noteId',
    type: MongoIdType,
    example: MongoIdExample,
    description: 'id заметки',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: NoteModuleGetByIdResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/by-id')
  async getById(@MongoId('noteId') noteId: Types.ObjectId, @MongoQueryOptions<NoteModel>(['lesson']) queryOptions?: QueryOptions) {
    return {
      note: await this.noteService.getById(noteId, queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить список заметок для занятия',
  })
  @ApiQuery({
    name: 'lessonId',
    type: MongoIdType,
    example: MongoIdExample,
    description: 'id занятия, для которого нужно получить заметки',
  })
  @ApiQuery({
    name: 'week',
    type: Number,
    example: 3,
    description: 'Номер недели, для которой нужно получить заметки',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: NoteModuleGetByLessonIdResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/by-lesson-id')
  async getByLessonId(
    @MongoId('lessonId') lessonId: Types.ObjectId,
    @IntQueryParam('week', { intType: 'positive' }) week: number,
    @MongoQueryOptions<NoteModel>(['lesson']) queryOptions?: QueryOptions
  ) {
    return {
      notes: await this.noteService.get(lessonId, week, queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет удалить заметку по id',
  })
  @ApiQuery({
    name: 'noteId',
    type: MongoIdType,
    example: MongoIdExample,
    description: 'id заметки',
  })
  @ApiQuery({
    name: 'deviceId',
    type: String,
    example: '43242342342',
    description:
      'id устройства, с которого была создана заметка. Заметку можно удалить только с того устройства, с которого она была создана',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete('/')
  async delete(@MongoId('noteId') noteId: Types.ObjectId, @StringQueryParam('deviceId') deviceId: DeviceId) {
    const candidate = await this.noteService.getById(noteId)

    if (deviceId !== candidate.deviceId) {
      throw new HttpException(INVALID_NOTE_DEVICE_ID(noteId, deviceId), HttpStatus.BAD_REQUEST)
    }

    await this.noteService.delete(noteId)
  }
}
