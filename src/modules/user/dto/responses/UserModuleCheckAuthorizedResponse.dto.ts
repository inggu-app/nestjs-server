import { ApiProperty } from '@nestjs/swagger'

export class UserModuleCheckAuthorizedResponseDto {
  @ApiProperty({
    description: 'Авторизован ли пользователь',
  })
  authorized: boolean
}
