import { IsMongoIdWithTransform } from '../../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsEnum } from 'class-validator'
import { LearningStage } from '../../constants/learningStage.constants'
import { ApiProperty } from '@nestjs/swagger'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'
import { IsUndefinable } from '../../../../global/decorators/isUndefinable.decorator'

export class UpdateLearningStageByFacultyDto {
  @ApiProperty({
    description: 'id факультета. Если поле facultyId не передавать, то стадия обучения будет устанавливать для всех групп',
    type: MongoIdType,
    example: MongoIdExample,
    required: false,
  })
  @IsUndefinable()
  @IsMongoIdWithTransform()
  facultyId?: Types.ObjectId

  @ApiProperty({
    description: 'Устанавливаемая стадия обучения',
    enum: LearningStage,
  })
  @IsEnum(LearningStage)
  learningStage: LearningStage
}
