import { ApiProperty } from '@nestjs/swagger'
import { UserModuleResponseUser } from './UserModuleCreateResponse.dto'

export class UserModuleGetAuthorizedUserResponseDto {
  @ApiProperty({
    type: UserModuleResponseUser,
  })
  user: UserModuleResponseUser
}
