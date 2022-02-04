import { IsMongoId, IsObject } from 'class-validator'
import { Type } from 'class-transformer'
import { AvailabilityDto } from './createAdminUser.dto'

export class UpdateAvailabilityDto {
  @IsMongoId()
  id: string

  @IsObject()
  @Type(() => AvailabilityDto)
  availability: AvailabilityDto
}
