import { GroupModuleResponseGroup } from './GroupModuleCreateResponseDto'
import { ApiProperty } from '@nestjs/swagger'

export class GroupModuleGetByIdResponseDto {
  @ApiProperty({
    type: GroupModuleResponseGroup,
  })
  group: GroupModuleResponseGroup
}
