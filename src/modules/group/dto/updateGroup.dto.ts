import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { MongoIdString } from '../../../global/types'

export class UpdateGroupDto {
  @IsMongoId()
  id: MongoIdString

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string

  @IsOptional()
  @IsMongoId()
  faculty: MongoIdString

  @IsOptional()
  @IsMongoId()
  callSchedule: MongoIdString
}
