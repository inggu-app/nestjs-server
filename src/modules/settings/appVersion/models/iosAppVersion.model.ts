import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../../../configs/modelDefaultOptions.config'
import { ALL_SETTINGS_TYPES, IOS_APP_VERSION_TYPE } from '../../settings.constants'

export interface IosAppVersionModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<IosAppVersionModel>(),
})
export class IosAppVersionModel extends TimeStamps {
  @prop({
    enum: ALL_SETTINGS_TYPES,
    default: IOS_APP_VERSION_TYPE,
  })
  settingType: string

  @prop({ default: [] })
  features: {
    version: string
    required: boolean
    desirable: boolean
    features: string[]
  }[]

  @prop({ default: '1.0.0' })
  version: string

  @prop({ default: true })
  isActive: boolean
}
