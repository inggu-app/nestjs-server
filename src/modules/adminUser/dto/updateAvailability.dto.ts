import { IsObject, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { AvailabilityDto } from './createAdminUser.dto'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateAvailabilityDto {
  @ApiProperty({
    title: 'Id администратора, разрешения которого необходимо обновить.',
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
  })
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @ApiProperty({
    title: 'Список разрешений, на которые нужно обновить текущие разрешения.',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityDto)
  availability: AvailabilityDto
}
