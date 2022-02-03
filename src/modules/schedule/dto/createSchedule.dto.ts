import { IsArray, IsEnum, IsMongoId, IsNumber, IsOptional, IsPositive, IsString, Min, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { WeekDaysEnum } from '../../../global/enums/WeekDays.enum'
import { WeeksTypeEnum } from '../schedule.constants'
import { MongoIdString } from '../../../global/types'

export class CreateScheduleDto {
  @IsMongoId()
  group: MongoIdString

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Lesson)
  schedule: Lesson[]
}

export class Lesson {
  @IsOptional()
  @IsMongoId()
  id: MongoIdString | undefined | null

  @IsString()
  title: string

  @IsString()
  teacher: string

  @IsNumber()
  @Min(0)
  number: number

  @IsString()
  classroom: string

  @IsEnum(WeekDaysEnum)
  weekDay: WeekDaysEnum

  @IsEnum(WeeksTypeEnum)
  weeksType: WeeksTypeEnum

  @IsNumber({}, { each: true })
  weeks: number[]

  @IsString()
  type: string

  @IsOptional()
  @IsPositive()
  subgroup: number
}
