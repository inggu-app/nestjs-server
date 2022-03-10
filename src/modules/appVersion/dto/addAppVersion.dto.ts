import { IsArray, IsEnum, IsNotEmpty, IsString, Matches, ValidateNested } from 'class-validator'
import { appVersionRegExp } from '../../../global/regex'
import { VersionFeatureSectionModel } from '../appVersion.model'
import { Type } from 'class-transformer'
import { OperationSystem } from '../../../global/enums/OS.enum'
import { ApiProperty } from '@nestjs/swagger'

class FeaturesDto implements VersionFeatureSectionModel {
  @ApiProperty({
    title: 'Название секции',
    example: 'Push-уведомления',
  })
  @IsString()
  @IsNotEmpty()
  sectionTitle: string

  @ApiProperty({
    title: 'Список обновлений, связанных с этой секцией',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  features: string[]
}

export class AddAppVersionDto {
  @ApiProperty({
    title: 'Операционная система, для которой добавляется обновление.',
    enum: OperationSystem,
  })
  @IsEnum(OperationSystem)
  os: OperationSystem

  @ApiProperty({
    title: 'Версия приложения',
    description: `Устанавливаемая версия приложения. Строка должна соответствовать регулярному выражению ${appVersionRegExp}`,
  })
  @Matches(appVersionRegExp)
  version: string

  @ApiProperty({
    title: 'Фичи, добавленные в обновлении',
    type: [FeaturesDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeaturesDto)
  features: FeaturesDto[]
}
