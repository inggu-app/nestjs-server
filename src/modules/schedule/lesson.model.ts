import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { FacultyModel } from '../faculty/faculty.model'
import { Types } from 'mongoose'
import { LessonFieldsEnum, WeeksTypeEnum } from './schedule.constants'
import { WeekDaysEnum } from '../../global/enums/WeekDays'

type Lesson = {
  [key in LessonFieldsEnum]: any
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

  @prop({
    enum: [
      WeekDaysEnum.MONDAY,
      WeekDaysEnum.TUESDAY,
      WeekDaysEnum.WEDNESDAY,
      WeekDaysEnum.THURSDAY,
      WeekDaysEnum.FRIDAY,
      WeekDaysEnum.SATURDAY,
      WeekDaysEnum.SUNDAY,
    ],
  })
  weekDay: number

  @prop({ enum: [WeeksTypeEnum.FIRST, WeeksTypeEnum.SECOND, WeeksTypeEnum.WEEKS] })
  weeksType: number

  @prop({ type: [Number] })
  weeks: number[]

  @prop()
  type: string

  @prop({ ref: () => FacultyModel, type: Types.ObjectId })
  group: Types.ObjectId
}
