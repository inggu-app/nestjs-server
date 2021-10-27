import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../../configs/modelDefaultOptions.config'
import { ALL_SETTINGS_TYPES } from '../settings.constants'

export interface CallScheduleModel {
  updatedAt: Date
}
export interface CallScheduleModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<CallScheduleModel>(),
})
export class CallScheduleModel extends TimeStamps {
  @prop({
    enum: ALL_SETTINGS_TYPES,
  })
  settingType: string

  @prop({ ref: () => CallScheduleItem })
  schedule: CallScheduleItem[]

  @prop({ default: true })
  isActive: boolean
}

class CallScheduleItem {
  lessonNumber: number

  start: Date

  end: Date
}
