import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsMongoId,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'

export class CreateScheduleDto {
  @IsMongoId()
  group: Types.ObjectId

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Lesson)
  schedule: Lesson[]
}

class Lesson {
  @IsString()
  title: string

  @IsString()
  teacher: string

  @IsNumber()
  @Min(0)
  number: number

  @IsString()
  classroom: string

  @IsIn([1, 2, 3, 4, 5, 6, 7])
  weekDay: number

  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  weeks: number[]

  @IsString()
  type: string
}
