import { ApiProperty } from '@nestjs/swagger'
import { UserModuleResponseRole } from './UserModuleCreateRoleResponse.dto'

export class UserModuleGetRolesByIdsResponseDto {
  @ApiProperty({
    type: UserModuleResponseRole,
    isArray: true,
  })
  roles: UserModuleResponseRole[]
}
