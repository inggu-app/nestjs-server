import { ApiProperty } from '@nestjs/swagger'
import { ResponseCallSchedule } from './CreateResponse.dto'

export class GetByFacultyIdResponseDto {
  @ApiProperty({
    type: ResponseCallSchedule,
    nullable: true,
  })
  callSchedule: ResponseCallSchedule | null
}
