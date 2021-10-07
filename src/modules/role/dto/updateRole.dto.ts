import { IsArray, IsIn, IsMongoId, IsString, ValidateNested } from 'class-validator'
import { Types } from 'mongoose'
import { Type } from 'class-transformer'
import { getEnumValues } from '../../../global/utils/enumKeysValues'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { AvailableFunctionality } from '../../functionality/functionality.constants'

export class UpdateRoleDto {
  @IsMongoId()
  id: Types.ObjectId

  @IsString()
  title: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Functionality)
  functionalities: Functionality[]
}

class Functionality implements AvailableFunctionality {
  @IsIn(getEnumValues(FunctionalityCodesEnum))
  code: FunctionalityCodesEnum

  @IsArray()
  @Type(() => Object)
  data: {
    [key: string]: any
  }[]
}
