import { ApiProperty } from '@nestjs/swagger'
import { LearningStageModuleResponseLearningStage } from './LearningStageModuleCreateResponse.dto'

export class LearningStageModuleGetByDateResponseDto {
  @ApiProperty({
    type: LearningStageModuleResponseLearningStage,
  })
  learningStage: LearningStageModuleResponseLearningStage
}
