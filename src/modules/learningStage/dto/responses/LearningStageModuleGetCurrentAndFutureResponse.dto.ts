import { ApiProperty } from '@nestjs/swagger'
import { LearningStageModuleResponseLearningStage } from './LearningStageModuleCreateResponse.dto'

export class LearningStageModuleGetCurrentAndFutureResponseDto {
  @ApiProperty({
    type: LearningStageModuleResponseLearningStage,
    isArray: true,
  })
  learningStages: LearningStageModuleResponseLearningStage[]
}
