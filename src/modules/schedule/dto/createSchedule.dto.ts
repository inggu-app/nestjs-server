import {
  IsArray,
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'
import { WeekDaysEnum } from '../../../global/enums/WeekDays'
import { LessonFieldsEnum, WeeksTypeEnum } from '../schedule.constants'

export interface ICreateScheduleDto {
  group: Types.ObjectId
  schedule: LessonType[]
}

type LessonType = {
  [key in keyof Omit<typeof LessonFieldsEnum, 'group'>]: any
}

export class CreateScheduleDto implements ICreateScheduleDto {
  @IsMongoId()
  group: Types.ObjectId

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Lesson)
  schedule: Lesson[]
}

export class Lesson implements LessonType {
  @IsOptional()
  @IsMongoId()
  id: Types.ObjectId | undefined | null

  @IsString()
  title: string

  @IsString()
  teacher: string

  @IsNumber()
  @Min(0)
  number: number

  @IsString()
  classroom: string

  @IsIn([
    WeekDaysEnum.MONDAY,
    WeekDaysEnum.TUESDAY,
    WeekDaysEnum.WEDNESDAY,
    WeekDaysEnum.THURSDAY,
    WeekDaysEnum.FRIDAY,
    WeekDaysEnum.SATURDAY,
    WeekDaysEnum.SUNDAY,
  ])
  weekDay: WeekDaysEnum

  @IsIn([WeeksTypeEnum.WEEKS, WeeksTypeEnum.FIRST, WeeksTypeEnum.SECOND])
  weeksType: WeeksTypeEnum

  @IsNumber({}, { each: true })
  weeks: number[]

  @IsString()
  type: string

  @IsOptional()
  @IsPositive()
  subgroup: number
}
