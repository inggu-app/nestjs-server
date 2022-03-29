import { ApiProperty } from '@nestjs/swagger'
import { UserModuleResponseUser } from './UserModuleCreateResponse.dto'

export class UserModuleGetByIdsResponseDto {
  @ApiProperty({
    type: UserModuleResponseUser,
    isArray: true,
  })
  users: UserModuleResponseUser[]
}
