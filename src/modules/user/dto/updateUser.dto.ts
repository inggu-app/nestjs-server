import { IsArray, IsIn, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { getEnumValues } from '../../../global/utils/enumKeysValues'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { AvailableFunctionality } from '../../functionality/functionality.constants'
import { MongoIdString } from '../../../global/types'

export class UpdateUserDto implements UpdateUserDtoType {
  @IsMongoId()
  id: MongoIdString

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  login?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Functionality)
  available?: Functionality[]

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  roles?: MongoIdString[]
}

class Functionality implements AvailableFunctionality {
  @IsIn(getEnumValues(FunctionalityCodesEnum))
  code: FunctionalityCodesEnum

  @IsObject()
  data: {
    [key: string]: any
  }
}

export type UpdateUserDtoType = {
  [key in UpdateUserDtoKeysEnum]?: any
}

export enum UpdateUserDtoKeysEnum {
  id = 'id',
  name = 'name',
  login = 'login',
  available = 'available',
  roles = 'roles',
}
