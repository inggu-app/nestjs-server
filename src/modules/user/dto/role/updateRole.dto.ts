import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'
import { Types } from 'mongoose'
import { IsMongoIdWithTransform } from '../../../../global/decorators/IsMongoIdWithTransform.decorator'

export class UpdateRoleDto {
  @ApiProperty({
    description: 'id обновляемой роли',
    type: MongoIdType,
    example: MongoIdExample,
  })
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @ApiProperty({
    description: 'Название роли',
    maxLength: 60,
    minLength: 1,
  })
  @IsString()
  @MaxLength(60)
  @MinLength(1)
  label: string
}
