import { IsOptional, IsString, MaxLength } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'

export class UpdateAdminUserDto {
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @IsOptional()
  @IsString()
  @MaxLength(60)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(60)
  login?: string
}
