import { LessonModel } from '../../lesson.model'
import { ApiProperty } from '@nestjs/swagger'
import { WeekDaysEnum } from '../../../../global/enums/WeekDays.enum'
import { SubgroupEnum, WeeksTypeEnum } from '../../schedule.constants'
import { Types } from 'mongoose'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'

export class ScheduleModuleResponseLesson implements Partial<LessonModel> {
  @ApiProperty({
    title: 'id занятия',
    type: MongoIdType,
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
    description: `
    ${SubgroupEnum.NULL} - занятие не разбито на подгруппы
    ${SubgroupEnum.FIRST} - занятие привязано к первой подгруппе
    ${WeeksTypeEnum.SECOND} - занятие привязано ко второй подгруппе
    `,
    enum: SubgroupEnum,
    example: SubgroupEnum.NULL,
    required: false,
  })
  subgroup: SubgroupEnum

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
    type: MongoIdType,
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

export class ScheduleModuleGetByGroupIdResponseDto {
  @ApiProperty({
    type: ScheduleModuleResponseLesson,
    isArray: true,
  })
  schedule: ScheduleModuleResponseLesson[]

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date
}
