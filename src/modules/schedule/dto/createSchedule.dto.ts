import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { WeekDaysEnum } from '../../../global/enums/WeekDays.enum'
import { WeeksTypeEnum } from '../schedule.constants'
import { Types } from 'mongoose'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNullable } from '../../../global/decorators/IsNullable.decorator'

export class Lesson {
  @ApiProperty({
    required: false,
    title: 'Id существующего занятия',
    description:
      'Если передать id, то обновится уже сущестующее занятие, при условии, что занятие с таким id существует. Если id не передать, то создастся новое занятие.',
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
  })
  @IsUndefinable()
  @IsMongoIdWithTransform()
  id?: Types.ObjectId

  @ApiProperty({
    title: 'Название занятия',
    example: 'Дифф. уравнения',
    maxLength: 100,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string

  @ApiProperty({
    title: 'ФИО преподавателя',
    example: 'Петров Вася',
    maxLength: 100,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  teacher: string

  @ApiProperty({
    title: 'Номер занятия',
    example: 6,
    maxLength: 10,
    minLength: 1,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  number: number

  @ApiProperty({
    title: 'Аудитория занятия',
    example: 'А-303',
    maxLength: 60,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  classroom: string

  @ApiProperty({
    title: 'День недели, когда проводится занятие',
    enum: WeekDaysEnum,
  })
  @IsEnum(WeekDaysEnum)
  weekDay: WeekDaysEnum

  @ApiProperty({
    title: 'Тип недели, когда проводится занятие',
    description: `
    ${WeeksTypeEnum.ALL} - занятие проводится каждую неделю
    ${WeeksTypeEnum.FIRST} - занятие проводится на первых неделях
    ${WeeksTypeEnum.SECOND} - занятие проводится на вторых неделях
    ${WeeksTypeEnum.WEEKS} - нужно опираться на список недель в поле weeks
    `,
    enum: WeeksTypeEnum,
  })
  @IsEnum(WeeksTypeEnum)
  weeksType: WeeksTypeEnum

  @ApiProperty({
    title: 'Список недель, когда проводится занятие',
    description: `Имеет смысл только если в поле weeksType стоит значение ${WeeksTypeEnum.WEEKS}`,
    example: [1, 4, 5],
  })
  @ArrayMaxSize(40)
  @IsNumber({}, { each: true })
  weeks: number[]

  @ApiProperty({
    title: 'Тип занятия',
    example: 'ЛК',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  type: string

  @ApiProperty({
    required: false,
    title: 'Подгруппа, к которой привязано занятие',
    example: 3,
    nullable: true,
  })
  @IsNullable()
  @IsUndefinable()
  @IsPositive()
  subgroup?: number
}

export class CreateScheduleDto {
  @ApiProperty({
    title: 'Id группы, к которой призывается расписание занятий',
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
  })
  @IsMongoIdWithTransform()
  group: Types.ObjectId

  @ApiProperty({
    title: 'Список занятий',
    type: [Lesson],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Lesson)
  schedule: Lesson[]
}
