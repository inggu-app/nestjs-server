import { IsDate, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { LearningStage } from '../learningStage.constants'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateLearningStageDto {
  @ApiProperty({
    title: 'Стадия обучения',
    description: 'Создаваемая стадия обучения',
    enum: LearningStage,
  })
  @IsEnum(LearningStage)
  stage: LearningStage

  @ApiProperty({
    title: 'Название стадии обучения',
    example: 'Каникулы',
    maxLength: 60,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  title: string

  @ApiProperty({
    title: 'Описание стадии обучения',
    example: 'Летние каникулы 2022 года',
    maxLength: 120,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  description: string

  @ApiProperty({
    title: 'Дата начала стадии обучения',
    description: 'Стадии обучения не должны пересекаться',
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  start: Date

  @ApiProperty({
    title: 'Дата конца стадии обучения',
    description: 'Стадии обучения не должны пересекаться',
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  end: Date
}
