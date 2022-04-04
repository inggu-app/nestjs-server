import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { CallScheduleModel } from '../callSchedule/callSchedule.model'
import { Types } from 'mongoose'
import { LearningStage } from '../learningStage/learningStage.constants'

export class FacultyLearningStageModel {
  @prop({ enum: LearningStage })
  stage: LearningStage

  @prop({ required: true })
  start: Date

  @prop({ required: true })
  end: Date

  @prop({ required: true })
  label: string
}

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
  callSchedule: Ref<CallScheduleModel, Types.ObjectId> | null

  @prop({ type: [FacultyLearningStageModel], _id: false, default: [] })
  learningStages: FacultyLearningStageModel[]
}
