import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { Types } from 'mongoose'
import { WeeksTypeEnum } from './schedule.constants'
import { WeekDaysEnum } from '../../global/enums/WeekDays.enum'
import { GroupModel } from '../group/group.model'

export interface LessonModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<LessonModel>({
    collection: 'Lesson',
  }),
})
export class LessonModel extends TimeStamps {
  @prop()
  title: string

  @prop()
  teacher: string

  @prop()
  number: number

  @prop()
  classroom: string

  @prop({
    enum: WeekDaysEnum,
  })
  weekDay: number

  @prop({ enum: WeeksTypeEnum })
  weeksType: number

  @prop({ type: () => [Number] })
  weeks: number[]

  @prop()
  type: string

  @prop({ ref: () => GroupModel })
  group: Ref<GroupModel, Types.ObjectId>

  @prop({ default: null, type: Number })
  subgroup: number | null
}
