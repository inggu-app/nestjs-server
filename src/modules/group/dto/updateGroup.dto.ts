import { IsMongoId, IsNotEmpty, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class UpdateGroupDto {
  @IsMongoId()
  id: Types.ObjectId

  @IsString()
  @IsNotEmpty()
  title: string

  @IsMongoId()
  faculty: Types.ObjectId
}
