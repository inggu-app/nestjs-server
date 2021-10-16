import { IsArray, IsEnum, IsMongoId, IsObject, IsOptional, IsString } from 'class-validator'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { MongoIdString } from '../../../global/types'

export class UpdateRoleDto implements UpdateRoleDtoType {
  @IsMongoId()
  id: MongoIdString

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

export type UpdateRoleDtoType = {
  [key in UpdateRoleDtoKeysEnum]?: any
}

export enum UpdateRoleDtoKeysEnum {
  id = 'id',
  title = 'title',
  available = 'available',
  roleFields = 'roleFields',
  views = 'views',
}
