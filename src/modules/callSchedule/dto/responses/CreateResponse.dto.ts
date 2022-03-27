import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'
import { timeRegExp } from '../../../../global/regex'

class ResponseCallScheduleItem {
  @ApiProperty({
    title: 'Номер занятия, для которого задано расписание',
    example: 3,
  })
  lessonNumber: number

  @ApiProperty({
    title: 'Начало занятия',
    description: `Соответствует регулярному выражению ${timeRegExp}`,
    example: '10:40',
  })
  start: string

  @ApiProperty({
    title: 'Конец занятия',
    description: `Соответствует регулярному выражению ${timeRegExp}`,
    example: '12:10',
  })
  end: string
}

export class ResponseCallSchedule {
  @ApiProperty({
    title: 'id расписания звонков',
    type: MongoIdType,
    example: MongoIdExample,
    required: false,
  })
  id: Types.ObjectId

  @ApiProperty({
    title: 'Название расписания звонков',
    example: 'Глобальное расписание звонков',
    required: false,
  })
  name: string

  @ApiProperty({
    title: 'Само расписание звонков',
    type: ResponseCallScheduleItem,
    isArray: true,
    required: false,
  })
  schedule: ResponseCallScheduleItem[]

  @ApiProperty({
    title: 'Является ли это расписание дефолтным',
    required: false,
  })
  isDefault: boolean

  @ApiProperty({
    title: 'Дата последнего обновления самого расписания(поле schedule)',
    required: false,
  })
  scheduleUpdatedAt: Date

  @ApiProperty({
    title: 'Дата создания расписания звонков',
    required: false,
  })
  createdAt: Date

  @ApiProperty({
    title: 'Дата создания объекта расписания звонков',
    required: false,
  })
  updatedAt: Date
}

export class CreateResponseDto {
  @ApiProperty({
    type: ResponseCallSchedule,
  })
  callSchedule: ResponseCallSchedule
}
