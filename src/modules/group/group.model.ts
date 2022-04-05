import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { Types } from 'mongoose'
import { FacultyModel } from '../faculty/faculty.model'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { LearningStage } from '../learningStage/learningStage.constants'
import { timeRegExp } from '../../global/regex'

export class GroupLearningStageModel {
  @prop({ enum: LearningStage })
  stage: LearningStage

  @prop({ required: true })
  start: Date

  @prop({ required: true })
  end: Date

  @prop({ required: true })
  label: string
}

export class CallScheduleItemModel {
  @prop()
  lessonNumber: number

  @prop({ match: timeRegExp })
  start: string

  @prop({ match: timeRegExp })
  end: string
}

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
  faculty: Ref<FacultyModel, Types.ObjectId>

  @prop({ default: new Date() })
  lastScheduleUpdate: Date

  @prop({ default: false })
  isHaveSchedule: boolean

  @prop({ type: CallScheduleItemModel, default: [] })
  callSchedule: CallScheduleItemModel[]

  @prop({ required: true, enum: LearningStage })
  learningStage: LearningStage
}
