import { IsMongoId, IsNotEmpty, IsString } from 'class-validator'
import { MongoIdString } from '../../../global/types'

export class UpdateGroupDto {
  @IsMongoId()
  id: MongoIdString

  @IsString()
  @IsNotEmpty()
  title: string

  @IsMongoId()
  faculty: MongoIdString
}
