import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsBoolean } from 'class-validator'

export class UpdateUserUltraSuperDto {
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @IsBoolean()
  isUltraSuper: boolean
}
