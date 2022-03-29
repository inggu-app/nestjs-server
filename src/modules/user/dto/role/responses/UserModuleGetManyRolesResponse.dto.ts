import { ApiProperty } from '@nestjs/swagger'
import { UserModuleResponseRole } from './UserModuleCreateRoleResponse.dto'

export class UserModuleGetManyRolesResponseDto {
  @ApiProperty({
    type: UserModuleResponseRole,
    isArray: true,
  })
  roles: UserModuleResponseRole[]

  @ApiProperty({
    description: 'Количество всех ролей. Зависит от query-параметра label',
  })
  count: number
}
