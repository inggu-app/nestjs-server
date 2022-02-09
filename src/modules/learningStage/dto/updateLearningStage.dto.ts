import { IsDate, IsDefined, IsEnum, IsOptional, IsString } from 'class-validator'
import { LearningStage } from '../learningStage.constants'
import { Transform, Type } from 'class-transformer'
import { Types } from 'mongoose'
import { transformMongoIdWithParams } from '../../../global/utils/mongoId'

export class UpdateLearningStageDto {
  @IsDefined()
  @Transform(transformMongoIdWithParams)
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
