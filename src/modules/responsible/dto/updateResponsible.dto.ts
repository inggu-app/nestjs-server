import { Types } from 'mongoose'
import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator'

export class UpdateResponsibleDto {
  @IsMongoId()
  id: Types.ObjectId

  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  groups: Types.ObjectId[]

  @IsString()
  @IsNotEmpty()
  login: string

  @IsString()
  @IsNotEmpty()
  name: string
}
