import { IsArray, IsIn, IsMongoId, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator'
import { Types } from 'mongoose'
import { Type } from 'class-transformer'
import { getEnumValues } from '../../../global/utils/enumKeysValues'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { AvailableFunctionality } from '../../functionality/functionality.constants'

export class UpdateUserDto {
  @IsMongoId()
  id: Types.ObjectId

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  login: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Functionality)
  available: Functionality[]

  @IsArray()
  @IsMongoId({ each: true })
  roles: Types.ObjectId[]
}

class Functionality implements AvailableFunctionality {
  @IsIn(getEnumValues(FunctionalityCodesEnum))
  code: FunctionalityCodesEnum

  @IsObject()
  data: {
    [key: string]: any
  }
}
