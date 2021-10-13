import { IsArray, IsEnum, IsMongoId, IsObject, IsOptional, IsString } from 'class-validator'
import { Types } from 'mongoose'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { MongoIdString } from '../../../global/types'

export class UpdateRoleDto {
  @IsMongoId()
  id: Types.ObjectId

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsArray()
  @IsEnum(FunctionalityCodesEnum, { each: true })
  available?: FunctionalityCodesEnum[]

  @IsOptional()
  @IsObject()
  roleFields?: {
    [key: string]: any
  }

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  views?: MongoIdString[]
}
