import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../../configs/modelDefaultOptions.config'
import { ALL_SETTINGS_TYPES } from '../settings.constants'

export interface AppVersionModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<AppVersionModel>(),
})
export class AppVersionModel extends TimeStamps {
  @prop({
    enum: ALL_SETTINGS_TYPES,
  })
  settingType: string

  @prop()
  iosVersion: string

  @prop()
  androidVersion: string

  @prop({ default: true })
  isActive: boolean
}
