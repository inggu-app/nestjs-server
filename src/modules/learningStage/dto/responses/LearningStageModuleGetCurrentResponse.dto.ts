import { ApiProperty } from '@nestjs/swagger'
import { LearningStageModuleResponseLearningStage } from './LearningStageModuleCreateResponse.dto'

export class LearningStageModuleGetCurrentResponseDto {
  @ApiProperty({
    type: LearningStageModuleResponseLearningStage,
  })
  learningStage: LearningStageModuleResponseLearningStage
}
