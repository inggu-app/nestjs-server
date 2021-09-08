import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { FacultyModel } from '../faculty/faculty.model'
import { Types } from 'mongoose'
import { ScheduleFieldsEnum } from './schedule.constants'

type Lesson = {
  [key in ScheduleFieldsEnum]: any
}

export interface LessonModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<LessonModel>(),
})
export class LessonModel extends TimeStamps implements Lesson {
  @prop()
  title: string

  @prop()
  teacher: string

  @prop()
  number: number

  @prop()
  classroom: string

  @prop({ enum: [1, 2, 3, 4, 5, 6, 7] })
  weekDay: number

  @prop({ type: [Number] })
  weeks: number[]

  @prop()
  type: string

  @prop({ ref: () => FacultyModel, type: Types.ObjectId })
  group: Types.ObjectId
}
