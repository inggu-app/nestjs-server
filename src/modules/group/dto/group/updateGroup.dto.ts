import { IsArray, IsEnum, IsNotEmpty, IsObject, IsString, MaxLength, ValidateNested } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsUndefinable } from '../../../../global/decorators/isUndefinable.decorator'
import { GroupModel } from '../../group.model'
import { LearningStage } from '../../../learningStage/learningStage.constants'
import { Type } from 'class-transformer'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'
import { CallScheduleItemDto } from '../callSchedule/updateByFaculty.dto'

export class UpdateGroupDto implements Partial<GroupModel> {
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
    title: 'Расписание звонков группы',
    type: CallScheduleItemDto,
    isArray: true,
  })
  @IsUndefinable()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CallScheduleItemDto)
  callSchedule?: CallScheduleItemDto[]

  @ApiProperty({
    required: false,
    title: 'Стадия обучения группы',
    enum: LearningStage,
  })
  @IsUndefinable()
  @IsEnum(LearningStage)
  learningStage?: LearningStage
}
