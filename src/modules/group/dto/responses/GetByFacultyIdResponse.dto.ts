import { ApiProperty } from '@nestjs/swagger'
import { ResponseGroup } from './CreateResponse.dto'

export class GetByFacultyIdResponseDto {
  @ApiProperty({
    type: ResponseGroup,
    isArray: true,
  })
  groups: ResponseGroup[]
}
