import { ApiProperty } from '@nestjs/swagger'
import { GroupModuleResponseGroup } from './GroupModuleCreateResponseDto'

export class GroupModuleGetByIdsResponseDto {
  @ApiProperty({
    type: GroupModuleResponseGroup,
    isArray: true,
  })
  groups: GroupModuleResponseGroup[]
}
