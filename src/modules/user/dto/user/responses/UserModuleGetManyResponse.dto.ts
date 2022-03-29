import { ApiProperty } from '@nestjs/swagger'
import { UserModuleResponseUser } from './UserModuleCreateResponse.dto'

export class UserModuleGetManyResponseDto {
  @ApiProperty({
    type: UserModuleResponseUser,
    isArray: true,
  })
  users: UserModuleResponseUser[]

  @ApiProperty({
    description: 'Количество всех пользователей. Количество зависит от переданного query-параметра name',
  })
  count: number
}
