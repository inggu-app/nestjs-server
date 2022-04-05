import { IsEnum } from 'class-validator'
import { LearningStage } from '../../constants/learningStage.constants'

export class UpdateLearningStageForAllDto {
  @IsEnum(LearningStage)
  learningStage: LearningStage
}
