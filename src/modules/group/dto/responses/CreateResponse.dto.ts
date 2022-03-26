import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { GroupModel } from '../../group.model'
import { MongoIdType, MongoIdExample } from '../../../../global/constants/constants'

export class ResponseGroup implements Partial<GroupModel> {
  @ApiProperty({
    title: 'id группы',
    type: MongoIdType,
    example: MongoIdExample,
    required: false,
  })
  id: Types.ObjectId

  @ApiProperty({
    title: 'Название группы',
    example: 'Группа',
    required: false,
  })
  title: string

  @ApiProperty({
    title: 'id факультета, к которому привязана группа',
    type: MongoIdType,
    example: MongoIdExample,
    required: false,
  })
  faculty: Types.ObjectId

  @ApiProperty({
    title: 'Дата последнего обновления расписания',
    type: Date,
    required: false,
  })
  lastScheduleUpdate: Date

  @ApiProperty({
    title: 'Есть ли расписание у группы',
    required: false,
  })
  isHaveSchedule: boolean

  @ApiProperty({
    title: 'Расписание звонков группы',
    description: 'Если значение null, то расписание звонков будет либо факультета, если оно у него есть, либо глобальное расписание',
    type: MongoIdType,
    example: MongoIdExample,
    nullable: true,
    required: false,
  })
  callSchedule: Types.ObjectId | null

  @ApiProperty({
    title: 'Дата создания группы',
    type: Date,
    required: false,
  })
  createdAt: Date

  @ApiProperty({
    title: 'Дата последнего обновления группы',
    type: Date,
    required: false,
  })
  updatedAt: Date
}

export class CreateResponseDto {
  @ApiProperty({
    type: ResponseGroup,
    required: false,
  })
  group: ResponseGroup
}
