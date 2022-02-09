import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { CallScheduleModel } from '../callSchedule/callSchedule.model'
import { Types } from 'mongoose'

export interface FacultyModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<FacultyModel>({
    collection: 'Faculty',
  }),
})
export class FacultyModel extends TimeStamps {
  @prop({ unique: true })
  title: string

  @prop({ ref: () => CallScheduleModel, default: null })
  callSchedule: Ref<CallScheduleModel, Types.ObjectId>
}
