import { ApiProperty } from '@nestjs/swagger'
import { CallScheduleModuleResponseCallSchedule } from './CallScheduleModuleCreateResponseDto'

export class CallScheduleModuleGetByNameResponseDto {
  @ApiProperty({
    type: CallScheduleModuleResponseCallSchedule,
  })
  callSchedule: CallScheduleModuleResponseCallSchedule
}
