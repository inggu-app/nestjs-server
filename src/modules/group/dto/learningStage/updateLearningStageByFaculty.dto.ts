import { IsMongoIdWithTransform } from '../../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsEnum } from 'class-validator'
import { LearningStage } from '../../../learningStage/learningStage.constants'

export class UpdateLearningStageByFacultyDto {
  @IsMongoIdWithTransform()
  facultyId: Types.ObjectId

  @IsEnum(LearningStage)
  learningStage: LearningStage
}
