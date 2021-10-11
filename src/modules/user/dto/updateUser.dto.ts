import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
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

export class Functionality implements AvailableFunctionality {
  @IsEnum(FunctionalityCodesEnum)
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
