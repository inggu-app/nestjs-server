import { ResponseGroup } from './CreateResponse.dto'
import { ApiProperty } from '@nestjs/swagger'

export class GetByIdResponseDto {
  @ApiProperty({
    type: ResponseGroup,
  })
  group: ResponseGroup
}
