import { ApiProperty } from '@nestjs/swagger'
import { CallScheduleModuleResponseCallSchedule } from './CallScheduleModuleCreateResponseDto'

export class CallScheduleModuleGetByGroupIdResponseDto {
  @ApiProperty({
    type: CallScheduleModuleResponseCallSchedule,
    nullable: true,
  })
  callSchedule: CallScheduleModuleResponseCallSchedule | null
}
