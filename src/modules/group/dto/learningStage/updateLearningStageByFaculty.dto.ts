import { IsMongoIdWithTransform } from '../../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsEnum } from 'class-validator'
import { LearningStage } from '../../constants/learningStage.constants'
import { ApiProperty } from '@nestjs/swagger'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'

export class UpdateLearningStageByFacultyDto {
  @ApiProperty({
    description: 'id факультета',
    type: MongoIdType,
    example: MongoIdExample,
  })
  @IsMongoIdWithTransform()
  facultyId: Types.ObjectId

  @ApiProperty({
    description: 'Устанавливаемая стадия обучения',
    enum: LearningStage,
  })
  @IsEnum(LearningStage)
  learningStage: LearningStage
}
