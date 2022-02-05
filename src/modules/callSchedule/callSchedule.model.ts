import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'

export interface CallScheduleModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<CallScheduleModel>({
    collection: 'CallSchedule',
  }),
})
export class CallScheduleModel extends TimeStamps {
  @prop({ required: true })
  schedule: CallScheduleItemModel[]

  @prop({ required: true, unique: true })
  name: string

  @prop({ default: false })
  isDefault: boolean

  @prop({ default: true })
  isActive: boolean

  @prop({ default: new Date() })
  scheduleUpdatedAt: Date
}

export class CallScheduleItemModel {
  @prop()
  lessonNumber: number

  @prop()
  start: Date

  @prop()
  end: Date
}
