import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdatePasswordDto {
  @ApiProperty({
    title: 'Логин администратора, пароль которого нужно обновить.',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  login: string

  @ApiProperty({
    title: 'Пароль, на который нужно обновить текущий пароль.',
    example: '123456',
  })
  @IsString()
  @MaxLength(30)
  password: string
}
