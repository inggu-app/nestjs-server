import { Types } from 'mongoose'
import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator'

export class CreateResponsibleDto {
  @IsArray()
  @IsMongoId({ each: true })
  groups: Types.ObjectId[]

  @IsArray()
  @IsMongoId({ each: true })
  faculties: Types.ObjectId[]

  @IsArray()
  @IsMongoId({ each: true })
  forbiddenGroups: Types.ObjectId[]

  @IsString()
  @IsNotEmpty()
  login: string

  @IsString()
  @IsNotEmpty()
  name: string
}
