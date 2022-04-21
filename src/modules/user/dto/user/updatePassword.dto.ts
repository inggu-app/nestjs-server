import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePasswordDto {
  @ApiProperty({
    title: 'Логин пользователя, пароль которого нужно обновить.',
    example: 'admin',
    maxLength: 60,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  login: string

  @ApiProperty({
    title: 'Пароль, на который нужно обновить текущий пароль.',
    example: '123456',
    maxLength: 30,
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  password: string
}
