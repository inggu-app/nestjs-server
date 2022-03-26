import { ApiProperty } from '@nestjs/swagger'
import { ResponseGroup } from './CreateResponse.dto'

export class GetByIdsResponseDto {
  @ApiProperty({
    type: ResponseGroup,
    isArray: true,
  })
  groups: ResponseGroup[]
}
