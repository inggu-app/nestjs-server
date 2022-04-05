import { IsObject, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CallScheduleItemDto } from './updateCallScheduleByFaculty.dto'

export class UpdateCallScheduleForAllGroupsDto {
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CallScheduleItemDto)
  callSchedule: CallScheduleItemDto[]
}
