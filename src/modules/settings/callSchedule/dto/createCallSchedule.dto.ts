import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { LessonCallSchedule } from '../callSchedule.model'

export class CreateCallScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonCallSchedule)
  schedule: LessonCallSchedule[]
}
