import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CallScheduleItemModel } from '../callSchedule.model'

export class CreateCallScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CallScheduleItem)
  schedule: CallScheduleItem[]

  @IsString()
  @IsNotEmpty()
  name: string
}

export class CallScheduleItem implements CallScheduleItemModel {
  @IsNumber()
  lessonNumber: number

  @IsDateString()
  start: Date

  @IsDateString()
  end: Date
}
