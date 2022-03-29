import { ApiProperty } from '@nestjs/swagger'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'
import { Types } from 'mongoose'
import { IsMongoIdWithTransform } from '../../../../global/decorators/IsMongoIdWithTransform.decorator'

export class UpdateRolesDto {
  @ApiProperty({
    description: 'id пользователя, роли которого нужно обновить',
    type: MongoIdType,
    example: MongoIdExample,
  })
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @ApiProperty({
    description: 'Роли назначенные пользователю',
    isArray: true,
    type: MongoIdType,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  roles: Types.ObjectId[]
}
