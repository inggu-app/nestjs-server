import { IsMongoId, IsNotEmpty, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class UpdateFacultyDto {
  @IsMongoId()
  id: Types.ObjectId

  @IsString()
  @IsNotEmpty()
  title: string
}
