import { ApiProperty } from '@nestjs/swagger'
import { ResponseCallSchedule } from './CreateResponse.dto'

export class GetByNameResponseDto {
  @ApiProperty({
    type: ResponseCallSchedule,
  })
  callSchedule: ResponseCallSchedule
}
