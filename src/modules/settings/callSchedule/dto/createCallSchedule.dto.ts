import { IsArray, IsDateString, IsNumber, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateCallScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CallScheduleItem)
  schedule: CallScheduleItem[]
}

class CallScheduleItem {
  @IsNumber()
  lessonNumber: number

  @IsDateString()
  start: Date

  @IsDateString()
  end: Date
}
