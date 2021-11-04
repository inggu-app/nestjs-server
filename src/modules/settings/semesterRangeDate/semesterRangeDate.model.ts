import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../../configs/modelDefaultOptions.config'
import { ALL_SETTINGS_TYPES } from '../settings.constants'

export interface SemesterRangeDateModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<SemesterRangeDateModel>({
    collection: 'Settings',
  }),
})
export class SemesterRangeDateModel extends TimeStamps {
  @prop({
    enum: ALL_SETTINGS_TYPES,
  })
  settingType: string

  @prop()
  startDate: Date

  @prop()
  endDate: Date

  @prop()
  isActive: boolean
}
