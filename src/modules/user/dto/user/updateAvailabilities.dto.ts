import { IsObject, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { AvailabilitiesDto } from './createUser.dto'
import { IsMongoIdWithTransform } from '../../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'

export class UpdateAvailabilitiesDto {
  @ApiProperty({
    title: 'id пользователя, разрешения которого необходимо обновить.',
    type: MongoIdType,
    example: MongoIdExample,
  })
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @ApiProperty({
    title:
      'Список разрешений, на которые нужно обновить текущие разрешения. Нужно передавать только те разрешения, которые нужно обновить. Те, что обновляеть не нужно, не нужно и передавать.',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilitiesDto)
  availabilities: AvailabilitiesDto
}
