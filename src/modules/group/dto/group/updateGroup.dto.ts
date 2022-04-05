import { IsArray, IsDate, IsEnum, IsNotEmpty, IsObject, IsString, MaxLength, ValidateNested } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsUndefinable } from '../../../../global/decorators/isUndefinable.decorator'
import { IsNullable } from '../../../../global/decorators/IsNullable.decorator'
import { GroupLearningStageModel } from '../../group.model'
import { LearningStage } from '../../../learningStage/learningStage.constants'
import { Type } from 'class-transformer'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'

export class UpdateGroupLearningStageDto implements GroupLearningStageModel {
  @ApiProperty({
    description: 'Тип стадии обучения',
    enum: LearningStage,
    example: [LearningStage.LEARNING],
  })
  @IsEnum(LearningStage)
  stage: LearningStage

  @ApiProperty({
    description: 'Старт стадии обучения',
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  start: Date

  @ApiProperty({
    description: 'Конец стадии обучения',
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  end: Date

  @ApiProperty({
    description: 'Описание стадии обучения',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label: string
}

export class UpdateGroupDto {
  @ApiProperty({
    title: 'Id группы',
    description: 'Id группы, которую необходимо обновить',
    example: MongoIdExample,
    type: MongoIdType,
  })
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @ApiProperty({
    required: false,
    title: 'Название, на которое необходимо заменить текущее название группы',
    example: 'Группа',
    maxLength: 60,
    minLength: 1,
  })
  @IsUndefinable()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  title?: string

  @ApiProperty({
    required: false,
    title: 'Id факультета, на который необходимо заменить текущий факультет',
    example: MongoIdExample,
    type: MongoIdType,
  })
  @IsUndefinable()
  @IsMongoIdWithTransform()
  faculty?: Types.ObjectId

  @ApiProperty({
    required: false,
    title: 'Id расписания звонков, на которое необходимо заменить текущее расписание',
    example: MongoIdExample,
    type: MongoIdType,
    nullable: true,
  })
  @IsUndefinable()
  @IsNullable()
  @IsMongoIdWithTransform()
  callSchedule?: Types.ObjectId | null

  @ApiProperty({
    required: false,
    title:
      'Стадии обучения именно этой группы. Если случится так, что у группы стадия обучения отличается от дефолтной, то здесь должна быть актуальная стадия обучения',
    type: UpdateGroupLearningStageDto,
    isArray: true,
  })
  @IsUndefinable()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => UpdateGroupLearningStageDto)
  learningStages?: UpdateGroupLearningStageDto[]
}
