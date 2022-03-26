import { LessonModel } from '../../lesson.model'
import { ApiProperty } from '@nestjs/swagger'
import { WeekDaysEnum } from '../../../../global/enums/WeekDays.enum'
import { WeeksTypeEnum } from '../../schedule.constants'
import { Types } from 'mongoose'
import { MongoId, MongoIdExample } from '../../../../global/constants/constants'

export class ResponseLesson implements Partial<LessonModel> {
  @ApiProperty({
    title: 'id занятия',
    type: MongoId,
    example: MongoIdExample,
    required: false,
  })
  id: Types.ObjectId

  @ApiProperty({
    title: 'Название занятия',
    example: 'Занятие',
    required: false,
  })
  title: string

  @ApiProperty({
    title: 'Преподаватель занятия',
    example: 'Пупкин Вася',
    required: false,
  })
  teacher: string

  @ApiProperty({
    title: 'Список недель',
    type: [Number],
    example: [2, 4, 5, 6],
    description: 'Если в поле weekTypes стоит значение WEEKS, то в данном поле будет список недель, в которые будет идти занятие',
    required: false,
  })
  weeks: number[]

  @ApiProperty({
    title: 'Подгруппа',
    type: Number,
    example: null,
    required: false,
    nullable: true,
  })
  subgroup: number | null

  @ApiProperty({
    title: 'Номер занятия',
    example: 1,
    required: false,
  })
  number: number

  @ApiProperty({
    title: 'Аудитория занятия',
    required: false,
  })
  classroom: string

  @ApiProperty({
    title: 'День недели, когда проводится занятие',
    required: false,
    enum: WeekDaysEnum,
  })
  weekDay: WeekDaysEnum

  @ApiProperty({
    title: 'Тип недели, когда проводится занятие',
    required: false,
    description: `
    ${WeeksTypeEnum.ALL} - занятие проводится каждую неделю
    ${WeeksTypeEnum.FIRST} - занятие проводится на первых неделях
    ${WeeksTypeEnum.SECOND} - занятие проводится на вторых неделях
    ${WeeksTypeEnum.WEEKS} - нужно опираться на список недель в поле weeks
    `,
    enum: WeeksTypeEnum,
  })
  weeksType: WeeksTypeEnum

  @ApiProperty({
    title: 'Тип занятия',
    example: 'ПР',
    required: false,
  })
  type: string

  @ApiProperty({
    title: 'id группы',
    type: MongoId,
    example: MongoIdExample,
    description: 'id группы, к которой привязано занятие',
    required: false,
  })
  group: Types.ObjectId

  @ApiProperty({
    title: 'Дата создания занятия',
    required: false,
  })
  createdAt: Date

  @ApiProperty({
    title: 'Дата последнего обновления занятия',
    required: false,
  })
  updatedAt: Date
}

export class GetByGroupIdResponseDto {
  @ApiProperty({
    type: ResponseLesson,
    isArray: true,
  })
  schedule: ResponseLesson[]

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date
}
