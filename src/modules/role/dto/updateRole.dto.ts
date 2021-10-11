import { IsArray, IsEnum, IsMongoId, IsString } from 'class-validator'
import { Types } from 'mongoose'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'

export class UpdateRoleDto {
  @IsMongoId()
  id: Types.ObjectId

  @IsString()
  title: string

  @IsArray()
  @IsEnum(FunctionalityCodesEnum, { each: true })
  available: FunctionalityCodesEnum[]
}
