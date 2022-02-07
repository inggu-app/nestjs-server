import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { timeRegExp } from '../../global/regex'

export class CallScheduleItemModel {
  @prop()
  lessonNumber: number

  @prop({ match: timeRegExp })
  start: string

  @prop({ match: timeRegExp })
  end: string
}

export interface CallScheduleModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<CallScheduleModel>({
    collection: 'CallSchedule',
  }),
})
export class CallScheduleModel extends TimeStamps {
  @prop({ _id: false, required: true, type: () => CallScheduleItemModel })
  schedule: CallScheduleItemModel[]

  @prop({ required: true, unique: true })
  name: string

  @prop({ default: false })
  isDefault: boolean

  @prop({ default: new Date() })
  scheduleUpdatedAt: Date
}
