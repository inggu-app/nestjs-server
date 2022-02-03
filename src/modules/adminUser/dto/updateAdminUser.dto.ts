import { IsMongoId, IsOptional, IsString, Max } from 'class-validator'
import { MongoIdString } from '../../../global/types'

export class UpdateAdminUserDto {
  @IsMongoId()
  id: MongoIdString

  @IsOptional()
  @IsString()
  @Max(60)
  name: string

  @IsOptional()
  @IsString()
  @Max(60)
  login: string
}
