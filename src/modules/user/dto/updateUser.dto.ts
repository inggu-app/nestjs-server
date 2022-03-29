import { ArrayMaxSize, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { ClientInterfacesEnum } from '../../../global/enums/ClientInterfaces.enum'

export class UpdateUserDto {
  @ApiProperty({
    title: 'id пользователя, которого необходимо обновить',
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
  })
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @ApiProperty({
    required: false,
    title: 'Имя пользователя, на которое нужно заменить текущее имя.',
    example: 'Пользователь',
    maxLength: 60,
    minLength: 1,
  })
  @IsUndefinable()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name?: string

  @ApiProperty({
    required: false,
    title: 'Логин пользователя, на который нужно заменить текущее имя.',
    example: 'admin',
    maxLength: 60,
    minLength: 1,
  })
  @IsUndefinable()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  login?: string

  @ApiProperty({
    required: false,
    description: 'Список доступных для авторизации интерфейсов, на который нужно заменить текущий список.',
    enum: ClientInterfacesEnum,
    example: [ClientInterfacesEnum.ADMIN_MOBILE_APP],
    maxLength: Object.keys(ClientInterfacesEnum).length,
    isArray: true,
  })
  @IsUndefinable()
  @IsEnum(ClientInterfacesEnum, { each: true })
  @ArrayMaxSize(Object.keys(ClientInterfacesEnum).length)
  interfaces?: ClientInterfacesEnum[]
}
