import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'

export class NoteModuleResponseNote {
  @ApiProperty({
    type: MongoIdType,
    example: MongoIdExample,
    description: 'id заметки',
    required: false,
  })
  id: Types.ObjectId

  @ApiProperty({ maxLength: 1000, minLength: 1, example: 'Заметка', description: 'Содержание заметки', required: false })
  content: string

  @ApiProperty({ description: 'id устройства, с которого была создана заметка', example: '43242342342', required: false })
  deviceId: string

  @ApiProperty({ minimum: 1, description: 'Неделя, к которой привязана заметка', example: 4, required: false })
  week: number

  @ApiProperty({ type: MongoIdType, example: MongoIdExample, description: 'id занятия, к которому привязана заметка', required: false })
  lesson: Types.ObjectId

  @ApiProperty({
    type: Date,
    description: 'Дата создания заметки',
    required: false,
  })
  createdAt: Date

  @ApiProperty({
    type: Date,
    description: 'Дата последнего обновления заметки',
    required: false,
  })
  updatedAt: Date
}

export class NoteModuleCreateResponseDto {
  @ApiProperty({
    type: NoteModuleResponseNote,
  })
  note: NoteModuleResponseNote
}
