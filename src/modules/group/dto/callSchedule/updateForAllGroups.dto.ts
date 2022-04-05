import { IsObject, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CallScheduleItemDto } from './updateByFaculty.dto'

export class UpdateForAllGroupsDto {
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CallScheduleItemDto)
  callSchedule: CallScheduleItemDto[]
}
