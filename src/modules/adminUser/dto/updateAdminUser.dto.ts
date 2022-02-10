import { IsString, MaxLength } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'

export class UpdateAdminUserDto {
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @IsUndefinable()
  @IsString()
  @MaxLength(60)
  name?: string

  @IsUndefinable()
  @IsString()
  @MaxLength(60)
  login?: string
}
