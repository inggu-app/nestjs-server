import { IsEnum } from 'class-validator'
import { LearningStage } from '../../../learningStage/learningStage.constants'

export class UpdateLearningStageForAllDto {
  @IsEnum(LearningStage)
  learningStage: LearningStage
}
