import { ApiProperty } from '@nestjs/swagger'
import { GroupModuleResponseGroup } from './GroupModuleCreateResponseDto'

export class GroupModuleGetByFacultyIdResponseDto {
  @ApiProperty({
    type: GroupModuleResponseGroup,
    isArray: true,
  })
  groups: GroupModuleResponseGroup[]
}
