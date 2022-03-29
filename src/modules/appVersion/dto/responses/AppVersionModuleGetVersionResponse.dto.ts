import { ApiProperty } from '@nestjs/swagger'
import { OperationSystem } from '../../../../global/enums/OS.enum'
import { appVersionRegExp } from '../../../../global/regex'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'
import { Types } from 'mongoose'

class AppVersionModuleResponseAppVersionFeatureItem {
  @ApiProperty({
    description: 'Название секции обновлений',
    example: 'Обновления форума',
  })
  sectionTitle: string

  @ApiProperty({
    description: 'Фичи, которые относятся к этой секции',
    type: String,
    isArray: true,
  })
  features: string[]
}

export class AppVersionModuleResponseAppVersion {
  @ApiProperty({
    type: MongoIdType,
    example: MongoIdExample,
    description: 'id обновления',
  })
  id: Types.ObjectId

  @ApiProperty({
    enum: OperationSystem,
    description: 'Операционная система, для которой предназначено обновление',
    required: false,
  })
  os: OperationSystem

  @ApiProperty({
    description: `Версия обновления. Соответствует регулярному выражению ${appVersionRegExp}`,
    required: false,
    example: '2.1.10',
  })
  version: string

  @ApiProperty({
    type: AppVersionModuleResponseAppVersionFeatureItem,
    description: 'Фичи, реализованные в этой версии',
    isArray: true,
    required: false,
  })
  features: AppVersionModuleResponseAppVersionFeatureItem[]

  @ApiProperty({
    description: 'Дата создания обновления',
    type: Date,
    required: false,
  })
  createdAt: Date

  @ApiProperty({
    description: 'Дата последнего обновления сущности обновления',
    type: Date,
    required: false,
  })
  updatedAt: Date
}

export class AppVersionModuleGetVersionResponseDto {
  @ApiProperty({
    type: AppVersionModuleResponseAppVersion,
  })
  version: AppVersionModuleResponseAppVersion
}
