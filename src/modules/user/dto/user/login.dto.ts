import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ClientInterfacesEnum } from '../../../../global/enums/ClientInterfaces.enum'

export class LoginDto {
  @ApiProperty({
    title: 'Логин пользователя',
    example: 'admin',
    maxLength: 60,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  login: string

  @ApiProperty({
    title: 'Пароль пользователя',
    example: '123456',
    maxLength: 30,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  password: string

  @ApiProperty({
    title: 'Интерфейс, через который пользователь пытается авторизоваться',
    example: ClientInterfacesEnum.MAIN_MOBILE_APP,
    enum: ClientInterfacesEnum,
  })
  @IsEnum(ClientInterfacesEnum)
  interface: ClientInterfacesEnum
}
