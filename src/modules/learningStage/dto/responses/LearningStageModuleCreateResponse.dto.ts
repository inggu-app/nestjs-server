import { ApiProperty } from '@nestjs/swagger'
import { LearningStage } from '../../learningStage.constants'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'
import { Types } from 'mongoose'

export class LearningStageModuleResponseLearningStage {
  @ApiProperty({
    description: 'id стадии',
    type: MongoIdType,
    example: MongoIdExample,
    required: false,
  })
  id: Types.ObjectId

  @ApiProperty({
    description: ` Тип стадии обучения
    ${LearningStage.LEARNING} - стадия обучения. В это время студенты учатся
    ${LearningStage.SESSION} - сессия. В это время студенты сдают экзамены
    ${LearningStage.HOLIDAYS} - каникулы. В это время студенты на каникулах
    ${LearningStage.OTHER} - какое-то другое время :/
    `,
    enum: LearningStage,
    required: false,
  })
  stage: LearningStage

  @ApiProperty({
    description: 'Название стадии обучения',
    example: 'Осенний семестр 22/23',
    required: false,
  })
  title: string

  @ApiProperty({
    description: 'Описание стадии обучения',
    example: 'В камине в шесть утра',
    required: false,
  })
  description: string

  @ApiProperty({
    description: 'Дата старта стадии. Стадия не должна пересекаться с другими стадиями',
    type: Date,
    required: false,
  })
  start: Date

  @ApiProperty({
    description: 'Дата конца стадии',
    type: Date,
    required: false,
  })
  end: Date

  @ApiProperty({
    description: 'Дата создания стадии',
    required: false,
  })
  createdAt: Date

  @ApiProperty({
    description: 'Дата последнего обновления стадии',
    required: false,
  })
  updatedAt: false
}

export class LearningStageModuleCreateResponseDto {
  @ApiProperty({
    type: LearningStageModuleResponseLearningStage,
  })
  learningStage: LearningStageModuleResponseLearningStage
}
