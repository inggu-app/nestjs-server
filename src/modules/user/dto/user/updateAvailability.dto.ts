import { IsObject, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { AvailabilitiesDto } from './createUser.dto'
import { IsMongoIdWithTransform } from '../../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateAvailabilityDto {
  @ApiProperty({
    title: 'id пользователя, разрешения которого необходимо обновить.',
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
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
  availability: AvailabilitiesDto
}
