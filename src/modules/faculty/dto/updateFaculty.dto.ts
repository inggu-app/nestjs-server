import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { MongoIdString } from '../../../global/types'

export class UpdateFacultyDto {
  @IsMongoId()
  id: MongoIdString

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string
}
