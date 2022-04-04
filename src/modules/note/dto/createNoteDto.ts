import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator'
import { DeviceId } from '../../../global/types'
import { Types } from 'mongoose'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { MongoIdExample, MongoIdType } from '../../../global/constants/constants'

export class CreateNoteDto {
  @ApiProperty({
    title: 'Содержание заметки',
    example: 'Домашнее задание',
    maxLength: 1000,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string

  @ApiProperty({
    title: 'Id устройства, на котором создана заметка',
    example: '4329023948034230423',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: DeviceId

  @ApiProperty({
    title: 'Номер недели, на которую назначена заметка',
    example: 14,
  })
  @IsInt()
  @Min(1)
  week: number

  @ApiProperty({
    title: 'Id занятия, к которому привязана заметка',
    example: MongoIdExample,
    type: MongoIdType,
  })
  @IsMongoIdWithTransform()
  lesson: Types.ObjectId
}
