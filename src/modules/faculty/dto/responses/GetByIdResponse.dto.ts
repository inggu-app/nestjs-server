import { ApiProperty } from '@nestjs/swagger'
import { ResponseFaculty } from './CreateResponse.dto'

export class GetByIdResponseDto {
  @ApiProperty({
    type: ResponseFaculty,
  })
  faculty: ResponseFaculty
}
