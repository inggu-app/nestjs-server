import { ApiProperty } from '@nestjs/swagger'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'
import { Types } from 'mongoose'
import { ClientInterfacesEnum } from '../../../../global/enums/ClientInterfaces.enum'
import { AvailabilityDto } from '../createUser.dto'

// {
//   "user": {
//   "interfaces": [
//     "ADMIN_WEB_APP"
//   ],
//     "name": "Пользователь",
//     "login": "user",
//     "availability": {
//     "canCreateFaculty": false,
//       "canUpdateFaculty": false,
//       "canDeleteFaculty": false,
//       "canCreateGroup": false,
//       "canUpdateGroup": false,
//       "canDeleteGroup": false,
//       "canUpdateCallSchedule": false,
//       "canUpdateSemesterRange": false,
//       "canCreateSchedule": false
//   },
//   "createdAt": "2022-03-29T13:18:58.328Z",
//     "updatedAt": "2022-03-29T13:18:58.328Z",
//     "id": "6243074290b014c007f8eae8"
// }
// }

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
    type: AvailabilityDto,
    required: false,
  })
  availability: AvailabilityDto

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
