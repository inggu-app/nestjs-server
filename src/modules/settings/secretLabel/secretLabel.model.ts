import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../../configs/modelDefaultOptions.config'
import { ALL_SETTINGS_TYPES } from '../settings.constants'

export interface SecretLabelModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<SecretLabelModel>({
    collection: 'Settings',
  }),
})
export class SecretLabelModel extends TimeStamps {
  @prop({
    enum: ALL_SETTINGS_TYPES,
  })
  settingType: string

  @prop()
  label: string

  @prop()
  isActive: boolean
}
