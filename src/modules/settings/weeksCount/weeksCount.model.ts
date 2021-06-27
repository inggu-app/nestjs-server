import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../../configs/modelDefaultOptions.config'
import { ALL_SETTINGS_TYPES } from '../settings.constants'

export interface WeeksCountModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<WeeksCountModel>(),
})
export class WeeksCountModel extends TimeStamps {
  @prop({
    enum: ALL_SETTINGS_TYPES,
  })
  settingType: string

  @prop()
  count: number

  @prop()
  isActive: boolean
}
