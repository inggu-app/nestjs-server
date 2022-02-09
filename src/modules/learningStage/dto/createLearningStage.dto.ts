import { IsDate, IsEnum, IsString } from 'class-validator'
import { LearningStage } from '../learningStage.constants'
import { Type } from 'class-transformer'

export class CreateLearningStageDto {
  @IsEnum(LearningStage)
  stage: LearningStage

  @IsString()
  title: string

  @IsString()
  description: string

  @Type(() => Date)
  @IsDate()
  start: Date

  @Type(() => Date)
  @IsDate()
  end: Date
}
