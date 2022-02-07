import { IsArray, IsEnum, IsString, Matches, ValidateNested } from 'class-validator'
import { appVersionRegExp } from '../../../global/regex'
import { VersionFeatureSectionModel } from '../appVersion.model'
import { Type } from 'class-transformer'
import { OperationSystem } from '../../../global/enums/OS.enum'

class FeaturesDto implements VersionFeatureSectionModel {
  @IsString()
  sectionTitle: string

  @IsArray()
  @IsString({ each: true })
  features: string[]
}

export class AddAppVersionDto {
  @IsEnum(OperationSystem)
  os: OperationSystem

  @Matches(appVersionRegExp)
  version: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeaturesDto)
  features: FeaturesDto[]
}
