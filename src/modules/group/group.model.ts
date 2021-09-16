import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { Types } from 'mongoose'
import { FacultyModel } from '../faculty/faculty.model'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { GroupFieldsEnum } from './group.constants'

export type GroupModelType = {
  [key in GroupFieldsEnum]: string | boolean | Date | Types.ObjectId
}

export interface GroupModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<GroupModel>(),
})
export class GroupModel extends TimeStamps implements GroupModelType {
  @prop()
  title: string

  @prop({ ref: () => FacultyModel, type: Types.ObjectId })
  faculty: Types.ObjectId

  @prop({ default: new Date() })
  lastScheduleUpdate: Date

  @prop({ default: false })
  isHaveSchedule: boolean
}
