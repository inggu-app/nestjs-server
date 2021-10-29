import { IsArray, IsBoolean, IsEnum, IsMongoId, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { MongoIdString } from '../../../global/types'
import { AvailableFunctionality } from '../../functionality/functionality.constants'
import { Type } from 'class-transformer'
import { TypesEnum } from '../../../global/enums/types.enum'
import { DbModelsEnum } from '../../../global/enums/dbModelsEnum'

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
  @IsNumber()
  priority: number

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Functionality)
  available?: Functionality[]

  @IsOptional()
  @IsObject()
  roleFields?: {
    [key: string]: RoleField
  }

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  views?: MongoIdString[]
}

class RoleField {
  @IsEnum(TypesEnum)
  type: TypesEnum

  @IsOptional()
  @IsEnum(DbModelsEnum)
  model: DbModelsEnum | null
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
  priority = 'priority',
  available = 'available',
  roleFields = 'roleFields',
  views = 'views',
}
