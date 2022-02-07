import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { OperationSystem } from '../../global/enums/OS.enum'
import { appVersionRegExp } from '../../global/regex'

export class VersionFeatureSectionModel {
  @prop()
  sectionTitle: string

  @prop({ type: () => String })
  features: string[]
}

export interface AppVersionModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<AppVersionModel>({
    collection: 'AppVersion',
  }),
})
export class AppVersionModel extends TimeStamps {
  @prop({ enum: OperationSystem })
  os: OperationSystem

  @prop({ match: appVersionRegExp })
  version: string

  @prop({ _id: false, required: true, type: () => VersionFeatureSectionModel })
  features: VersionFeatureSectionModel[]
}
