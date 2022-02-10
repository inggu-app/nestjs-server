import { IsArray, IsEnum, IsNumber, IsPositive, IsString, Min, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { WeekDaysEnum } from '../../../global/enums/WeekDays.enum'
import { WeeksTypeEnum } from '../schedule.constants'
import { Types } from 'mongoose'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'

export class CreateScheduleDto {
  @IsMongoIdWithTransform()
  group: Types.ObjectId

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Lesson)
  schedule: Lesson[]
}

export class Lesson {
  @IsMongoIdWithTransform(true)
  id?: Types.ObjectId

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

  @IsUndefinable()
  @IsPositive()
  subgroup: number
}
