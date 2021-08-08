import { Types } from 'mongoose'
import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator'
import { GroupModel } from '../../group/group.model'

export class UpdateResponsibleDto {
  @IsMongoId()
  id: Types.ObjectId

  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  groups: GroupModel[]

  @IsString()
  @IsNotEmpty()
  login: string

  @IsString()
  @IsNotEmpty()
  name: string
}
