import { IsMongoId, IsNotEmpty, IsString } from 'class-validator'
import { MongoIdString } from '../../../global/types'

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsMongoId()
  faculty: MongoIdString
}
