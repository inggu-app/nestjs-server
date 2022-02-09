import { IsObject } from 'class-validator'
import { Type } from 'class-transformer'
import { AvailabilityDto } from './createAdminUser.dto'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'

export class UpdateAvailabilityDto {
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @IsObject()
  @Type(() => AvailabilityDto)
  availability: AvailabilityDto
}
