import { IsEnum, IsMongoId, IsOptional, IsString, Matches } from 'class-validator'
import { MongoIdString } from '../../../global/types'
import { LearningStage } from '../learningStage.constants'
import { dateTimeRegExp } from '../../../global/regex'

export class UpdateLearningStageDto {
  @IsMongoId()
  id: MongoIdString

  @IsOptional()
  @IsEnum(LearningStage)
  stage?: LearningStage

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @Matches(dateTimeRegExp)
  start?: Date

  @IsOptional()
  @Matches(dateTimeRegExp)
  end?: Date
}
