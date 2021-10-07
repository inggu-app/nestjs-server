import { IsArray, IsBoolean, IsIn, IsString, Matches } from 'class-validator'
import { OperationSystems } from '../../../../global/enums/OS.enum'

export class SetFeaturesDto {
  @IsIn([OperationSystems.ANDROID, OperationSystems.IOS])
  os: OperationSystems

  @IsString()
  @Matches(/\d+.\d+.\d+/)
  version: string

  @IsArray()
  @IsString({ each: true })
  features: string[]

  @IsBoolean()
  required: boolean

  @IsBoolean()
  desirable: boolean
}
