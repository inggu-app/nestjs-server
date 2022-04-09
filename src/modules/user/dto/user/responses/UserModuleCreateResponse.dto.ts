import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { MongoIdExample, MongoIdType } from '../../../../../global/constants/constants'
import { Types } from 'mongoose'
import { ClientInterfacesEnum } from '../../../../../global/enums/ClientInterfaces.enum'
import { AvailabilitiesDto } from '../createUser.dto'
import { UserModuleResponseRole } from '../../role/responses/UserModuleCreateRoleResponse.dto'

export class UserModuleResponseUser {
  @ApiProperty({
    type: MongoIdType,
    example: MongoIdExample,
    description: 'id пользователя',
    required: false,
  })
  id: Types.ObjectId

  @ApiProperty({
    enum: ClientInterfacesEnum,
    description: 'Интерфейсы, к которым у пользователя есть доступ',
    isArray: true,
    required: false,
  })
  interfaces: ClientInterfacesEnum[]

  @ApiProperty({
    description: 'Роли пользователя',
    isArray: true,
    required: false,
    oneOf: [
      {
        type: MongoIdType,
        example: [MongoIdExample],
      },
      {
        type: 'array',
        items: {
          $ref: getSchemaPath(UserModuleResponseRole),
        },
      },
    ],
  })
  roles: (Types.ObjectId | UserModuleResponseRole)[]

  @ApiProperty({
    description: 'Имя пользователя',
    maxLength: 60,
    required: false,
  })
  name: string

  @ApiProperty({
    description: 'Логин пользователя',
    maxLength: 60,
    required: false,
  })
  login: string

  @ApiProperty({
    description: 'Разрешения пользователя',
    type: AvailabilitiesDto,
    required: false,
  })
  availabilities: AvailabilitiesDto

  @ApiProperty({
    description: 'Дата создания пользователя',
    type: Date,
    required: false,
  })
  createdAt: Date

  @ApiProperty({
    description: 'Дата последнего обновления пользователя',
    type: Date,
    required: false,
  })
  updatedAt: Date
}

export class UserModuleCreateResponseDto {
  @ApiProperty({
    type: UserModuleResponseUser,
  })
  user: UserModuleResponseUser
}
