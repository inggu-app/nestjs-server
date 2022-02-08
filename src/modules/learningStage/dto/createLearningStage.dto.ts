import { IsEnum, IsString, Matches } from 'class-validator'
import { LearningStage } from '../learningStage.constants'
import { dateTimeRegExp } from '../../../global/regex'

export class CreateLearningStageDto {
  @IsEnum(LearningStage)
  stage: LearningStage

  @IsString()
  title: string

  @IsString()
  description: string

  @Matches(dateTimeRegExp)
  start: Date

  @Matches(dateTimeRegExp)
  end: Date
}
