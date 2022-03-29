import { ApiProperty } from '@nestjs/swagger'
import { UserModuleResponseUser } from './UserModuleCreateResponse.dto'

export class UserModuleGetByIdResponseDto {
  @ApiProperty({
    type: UserModuleResponseUser,
  })
  user: UserModuleResponseUser
}
