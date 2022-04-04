import { IsDate, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { LearningStage } from '../learningStage.constants'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { MongoIdExample, MongoIdType } from '../../../global/constants/constants'

export class UpdateLearningStageDto {
  @ApiProperty({
    title: 'Id стадии обучения',
    example: MongoIdExample,
    type: MongoIdType,
  })
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @ApiProperty({
    required: false,
    title: 'Стадия обучения, на которую нужно заменить текущую стадию обучения',
    enum: LearningStage,
  })
  @IsUndefinable()
  @IsEnum(LearningStage)
  stage?: LearningStage

  @ApiProperty({
    required: false,
    title: 'Название стадии обучения',
    example: 'Каникулы',
    maxLength: 60,
    minLength: 1,
  })
  @IsUndefinable()
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  title?: string

  @ApiProperty({
    required: false,
    title: 'Описание стадии обучения',
    example: 'Летние каникулы 2022 года',
    maxLength: 120,
    minLength: 1,
  })
  @IsUndefinable()
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  description?: string

  @ApiProperty({
    required: false,
    title: 'Дата старта стадии обучения, на которую необходимо заменить текущий старт стадии обучения',
    type: Date,
  })
  @IsUndefinable()
  @Type(() => Date)
  @IsDate()
  start?: Date

  @ApiProperty({
    required: false,
    title: 'Дата конца стадии обучения, на которую необходимо заменить текущий конец стадии обучения',
    type: Date,
  })
  @IsUndefinable()
  @Type(() => Date)
  @IsDate()
  end?: Date
}
