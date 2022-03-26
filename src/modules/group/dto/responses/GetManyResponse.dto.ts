import { ResponseGroup } from './CreateResponse.dto'
import { ApiProperty } from '@nestjs/swagger'

export class GetManyResponseDto {
  @ApiProperty({
    title: 'Список групп',
    type: ResponseGroup,
    isArray: true,
  })
  groups: ResponseGroup[]

  @ApiProperty({
    title: 'Количество всех групп',
    description: 'Зависит от query-параметра title',
  })
  count: number
}
