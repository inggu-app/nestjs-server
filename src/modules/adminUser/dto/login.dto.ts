import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({
    title: 'Логин администратора',
    example: 'admin',
    maxLength: 60,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  login: string

  @ApiProperty({
    title: 'Пароль администратора',
    example: '123456',
    maxLength: 30,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  password: string
}
