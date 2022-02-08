import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { LearningStage } from './learningStage.constants'

export interface LearningStageModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<LearningStageModel>({
    collection: 'LearningStage',
  }),
})
export class LearningStageModel extends TimeStamps {
  @prop({ enum: LearningStage })
  stage: LearningStage

  @prop({ required: true })
  start: Date

  @prop({ required: true })
  end: Date

  @prop({ required: true })
  title: string

  @prop({ required: true })
  description: string
}
