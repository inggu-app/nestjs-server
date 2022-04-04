import { IsArray, IsDate, IsEnum, IsNotEmpty, IsObject, IsString, MaxLength, ValidateNested } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'
import { IsNullable } from '../../../global/decorators/IsNullable.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { MongoIdType } from '../../../global/constants/constants'
import { LearningStage } from '../../learningStage/learningStage.constants'
import { Type } from 'class-transformer'
import { FacultyLearningStageModel } from '../faculty.model'

export class UpdateFacultyLearningStageDto implements FacultyLearningStageModel {
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

export class UpdateFacultyDto {
  @ApiProperty({
    title: 'Id факультета, который нужно обновить.',
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
  })
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @ApiProperty({
    required: false,
    title: 'Название факультета',
    description: 'Название, на которое нужно заменить текущее название факультета. Название не может быть пустой строкой.',
    example: 'Экономический факультет',
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
    type: 'MongoId',
    title: 'Id расписания звонков',
    description:
      'Id расписания звонков, на которое необходимо заменить текущее расписание звонков. Можно передать null чтобы сбросить установленное расписание.',
    nullable: true,
  })
  @IsUndefinable()
  @IsNullable()
  @IsMongoIdWithTransform()
  callSchedule?: Types.ObjectId | null

  @ApiProperty({
    required: false,
    type: MongoIdType,
    description:
      'Стадии обучения, свойственные только этому факультету. Если у факультета какие-то уникальные стадии обучения, то их следует заносить здесь',
    isArray: true,
  })
  @IsUndefinable()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => UpdateFacultyLearningStageDto)
  learningStages?: UpdateFacultyLearningStageDto[]
}
