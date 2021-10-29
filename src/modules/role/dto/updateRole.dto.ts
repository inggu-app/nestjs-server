import { IsArray, IsBoolean, IsEnum, IsMongoId, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { MongoIdString } from '../../../global/types'
import { AvailableFunctionality } from '../../functionality/functionality.constants'
import { Type } from 'class-transformer'

export class UpdateRoleDto implements UpdateRoleDtoType {
  @IsMongoId()
  id: MongoIdString

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  code?: string

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Functionality)
  available?: Functionality[]

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

export class Functionality implements AvailableFunctionality {
  @IsEnum(FunctionalityCodesEnum)
  code: FunctionalityCodesEnum

  @IsObject()
  data: {
    [key: string]: any
  }
}

export type UpdateRoleDtoType = {
  [key in UpdateRoleDtoKeysEnum]?: any
}

export enum UpdateRoleDtoKeysEnum {
  id = 'id',
  title = 'title',
  code = 'code',
  isVisible = 'isVisible',
  available = 'available',
  roleFields = 'roleFields',
  views = 'views',
}
