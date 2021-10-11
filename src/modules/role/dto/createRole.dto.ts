import { IsArray, IsEnum, IsString } from 'class-validator'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'

export class CreateRoleDto {
  @IsString()
  title: string

  @IsArray()
  @IsEnum(FunctionalityCodesEnum, { each: true })
  available: FunctionalityCodesEnum[]
}
