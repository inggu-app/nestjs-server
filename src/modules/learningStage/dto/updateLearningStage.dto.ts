import { IsDate, IsEnum, IsString } from 'class-validator'
import { LearningStage } from '../learningStage.constants'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'

export class UpdateLearningStageDto {
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @IsUndefinable()
  @IsEnum(LearningStage)
  stage?: LearningStage

  @IsUndefinable()
  @IsString()
  title?: string

  @IsUndefinable()
  @IsString()
  description?: string

  @IsUndefinable()
  @Type(() => Date)
  @IsDate()
  start?: Date

  @IsUndefinable()
  @Type(() => Date)
  @IsDate()
  end?: Date
}
