import { ApiProperty } from '@nestjs/swagger'
import { ResponseFaculty } from './CreateResponse.dto'

export class GetManyResponseDto {
  @ApiProperty({
    type: ResponseFaculty,
    isArray: true,
  })
  faculties: ResponseFaculty[]

  @ApiProperty({
    title: 'Количество всех факультетов',
    description: 'Зависит от query-параметра title',
  })
  count: number
}
