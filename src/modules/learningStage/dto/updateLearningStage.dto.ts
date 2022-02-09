import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { LearningStage } from '../learningStage.constants'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'

export class UpdateLearningStageDto {
  @IsMongoIdWithTransform()
  id: Types.ObjectId

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
  @Type(() => Date)
  @IsDate()
  start?: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  end?: Date
}
