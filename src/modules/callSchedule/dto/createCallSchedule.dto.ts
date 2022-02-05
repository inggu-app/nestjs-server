import { IsArray, IsNotEmpty, IsNumber, IsString, Matches, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CallScheduleItemModel } from '../callSchedule.model'
import { timeRegExp } from '../../../global/regex'

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

  @Matches(timeRegExp)
  start: string

  @Matches(timeRegExp)
  end: string
}
