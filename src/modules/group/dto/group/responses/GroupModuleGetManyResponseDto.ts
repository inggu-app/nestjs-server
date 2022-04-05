import { GroupModuleResponseGroup } from './GroupModuleCreateResponseDto'
import { ApiProperty } from '@nestjs/swagger'

export class GroupModuleGetManyResponseDto {
  @ApiProperty({
    title: 'Список групп',
    type: GroupModuleResponseGroup,
    isArray: true,
  })
  groups: GroupModuleResponseGroup[]

  @ApiProperty({
    title: 'Количество всех групп',
    description: 'Зависит от query-параметра title',
  })
  count: number
}
