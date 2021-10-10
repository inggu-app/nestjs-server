import { IsArray, IsIn, IsMongoId, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { getEnumValues } from '../../../global/utils/enumKeysValues'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { AvailableFunctionality } from '../../functionality/functionality.constants'
import { MongoIdString } from '../../../global/types'

export class UpdateUserDto {
  @IsMongoId()
  id: MongoIdString

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
  roles: MongoIdString[]
}

class Functionality implements AvailableFunctionality {
  @IsIn(getEnumValues(FunctionalityCodesEnum))
  code: FunctionalityCodesEnum

  @IsObject()
  data: {
    [key: string]: any
  }
}
