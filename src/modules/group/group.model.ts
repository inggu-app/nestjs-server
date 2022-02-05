import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { Types } from 'mongoose'
import { FacultyModel } from '../faculty/faculty.model'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { CallScheduleModel } from '../callSchedule/callSchedule.model'

export interface GroupModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<GroupModel>({
    collection: 'Group',
  }),
})
export class GroupModel extends TimeStamps {
  @prop()
  title: string

  @prop({ ref: () => FacultyModel, type: Types.ObjectId })
  faculty: Types.ObjectId

  @prop({ default: new Date() })
  lastScheduleUpdate: Date

  @prop({ default: false })
  isHaveSchedule: boolean

  @prop({ ref: () => CallScheduleModel, default: null })
  callSchedule: Ref<CallScheduleModel, Types.ObjectId> | null
}
