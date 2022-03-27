import { ApiProperty } from '@nestjs/swagger'
import { ResponseCallSchedule } from './CreateResponse.dto'

export class GetByGroupIdResponseDto {
  @ApiProperty({
    type: ResponseCallSchedule,
    nullable: true,
  })
  callSchedule: ResponseCallSchedule | null
}
