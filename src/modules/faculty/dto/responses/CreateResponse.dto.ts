import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'

export class ResponseFaculty {
  @ApiProperty({
    title: 'id факультета',
    type: MongoIdType,
    example: MongoIdExample,
    required: false,
  })
  id: Types.ObjectId

  @ApiProperty({
    title: 'Название факультета',
    example: 'Факультет мемологии',
    required: false,
  })
  title: string

  @ApiProperty({
    title: 'id расписания звонков',
    description: 'Если значение равно null, то расписанием будет глобальное расписание звонков',
    type: MongoIdType,
    example: MongoIdExample,
    nullable: true,
    required: false,
  })
  callSchedule: Types.ObjectId | null

  @ApiProperty({
    title: 'Дата создания факультета',
    required: false,
  })
  createdAt: Date

  @ApiProperty({
    title: 'Дата последнего обновления факультета',
    required: false,
  })
  updatedAt: Date
}

export class CreateResponseDto {
  @ApiProperty({
    type: ResponseFaculty,
  })
  faculty: ResponseFaculty
}
