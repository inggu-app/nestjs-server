import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { Types } from 'mongoose'
import { FacultyModel } from '../faculty/faculty.model'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { CallScheduleModel } from '../callSchedule/callSchedule.model'
import { LearningStage } from '../learningStage/learningStage.constants'

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

  @prop({ ref: () => CallScheduleModel, default: null })
  callSchedule: Ref<CallScheduleModel, Types.ObjectId> | null

  @prop({ type: [GroupLearningStageModel], _id: false, default: [] })
  learningStages: GroupLearningStageModel[]
}
