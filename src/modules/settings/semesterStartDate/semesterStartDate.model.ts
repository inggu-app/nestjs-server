import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../../configs/modelDefaultOptions.config'
import { ALL_SETTINGS_TYPES } from '../settings.constants'

export interface SemesterStartDateModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<SemesterStartDateModel>({
    collection: 'Settings',
  }),
})
export class SemesterStartDateModel extends TimeStamps {
  @prop({
    enum: ALL_SETTINGS_TYPES,
  })
  settingType: string

  @prop()
  date: Date

  @prop()
  isActive: boolean
}
