import { IsMongoId, IsNotEmpty, IsString } from 'class-validator'
import { MongoIdString } from '../../../global/types'

export class UpdateFacultyDto {
  @IsMongoId()
  id: MongoIdString

  @IsString()
  @IsNotEmpty()
  title: string
}
