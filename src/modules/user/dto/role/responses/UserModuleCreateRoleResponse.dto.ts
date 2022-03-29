// {
//   "label": "Администратор",
//   "createdAt": "2022-03-29T21:14:35.003Z",
//   "updatedAt": "2022-03-29T21:14:35.003Z",
//   "id": "624376ba20e41cd0deceee4c"
// }

import { ApiProperty } from '@nestjs/swagger'
import { MongoIdExample, MongoIdType } from '../../../../../global/constants/constants'
import { Types } from 'mongoose'

export class UserModuleResponseRole {
  @ApiProperty({
    description: 'id роли',
    type: MongoIdType,
    example: MongoIdExample,
    required: false,
  })
  id: Types.ObjectId

  @ApiProperty({
    description: 'Название роли',
    maxLength: 60,
    required: false,
    example: 'Администратор',
  })
  label: string

  @ApiProperty({
    description: 'Дата создания роли',
    type: Date,
    required: false,
  })
  createdAt: Date

  @ApiProperty({
    description: 'Дата последнего обновления роли',
    type: Date,
    required: false,
  })
  updatedAt: Date
}

export class UserModuleCreateRoleResponseDto {
  @ApiProperty({
    type: UserModuleResponseRole,
  })
  role: UserModuleResponseRole
}
