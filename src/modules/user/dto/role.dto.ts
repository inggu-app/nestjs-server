import { IsMongoId, IsObject, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

export class RoleDto {
  @IsMongoId()
  role: Types.ObjectId

  @IsOptional()
  @IsObject()
  data: Record<string, any>
}
