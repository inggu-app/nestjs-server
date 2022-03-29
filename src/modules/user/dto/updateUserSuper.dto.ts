import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsBoolean } from 'class-validator'

export class UpdateUserSuperDto {
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @IsBoolean()
  isSuper: boolean
}
