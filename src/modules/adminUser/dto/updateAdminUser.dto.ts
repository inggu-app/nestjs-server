import { IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator'
import { MongoIdString } from '../../../global/types'

export class UpdateAdminUserDto {
  @IsMongoId()
  id: MongoIdString

  @IsOptional()
  @IsString()
  @MaxLength(60)
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(60)
  login: string
}
