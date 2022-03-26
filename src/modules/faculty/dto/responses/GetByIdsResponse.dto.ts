import { ApiProperty } from '@nestjs/swagger'
import { ResponseFaculty } from './CreateResponse.dto'

export class GetByIdsResponseDto {
  @ApiProperty({
    type: ResponseFaculty,
    isArray: true,
  })
  faculties: ResponseFaculty[]
}
