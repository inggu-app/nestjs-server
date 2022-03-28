import { ApiProperty } from '@nestjs/swagger'
import { CallScheduleModuleResponseCallSchedule } from './CallScheduleModuleCreateResponseDto'

export class CallScheduleModuleGetByIdResponseDto {
  @ApiProperty({
    type: CallScheduleModuleResponseCallSchedule,
  })
  callSchedule: CallScheduleModuleResponseCallSchedule
}
