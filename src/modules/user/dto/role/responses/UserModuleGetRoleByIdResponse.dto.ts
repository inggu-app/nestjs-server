import { ApiProperty } from '@nestjs/swagger'
import { UserModuleResponseRole } from './UserModuleCreateRoleResponse.dto'

export class UserModuleGetRoleByIdResponseDto {
  @ApiProperty({
    type: UserModuleResponseRole,
  })
  role: UserModuleResponseRole
}
