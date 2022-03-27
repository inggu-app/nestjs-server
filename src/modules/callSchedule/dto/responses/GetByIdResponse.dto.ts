import { ApiProperty } from '@nestjs/swagger'
import { ResponseCallSchedule } from './CreateResponse.dto'

export class GetByIdResponseDto {
  @ApiProperty({
    type: ResponseCallSchedule,
  })
  callSchedule: ResponseCallSchedule
}
