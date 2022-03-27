import { ApiProperty } from '@nestjs/swagger'
import { ResponseCallSchedule } from './CreateResponse.dto'

export class GetDefaultScheduleResponseDto {
  @ApiProperty({
    type: ResponseCallSchedule,
    nullable: true,
  })
  callSchedule: ResponseCallSchedule | null
}
