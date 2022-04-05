import { IsEnum, IsNotEmpty, IsObject, IsString, MaxLength, ValidateNested } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'
import { GroupModel } from '../../group.model'
import { CallScheduleItemDto } from '../callSchedule/updateByFaculty.dto'
import { Type } from 'class-transformer'
import { LearningStage } from '../../../learningStage/learningStage.constants'

export class CreateGroupDto implements Partial<GroupModel> {
  @ApiProperty({
    title: 'Название группы',
    example: 'Группа',
    maxLength: 60,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  title: string

  @ApiProperty({
    title: 'Id факультета, к которому привязывается группа',
    type: MongoIdType,
    example: MongoIdExample,
  })
  @IsMongoIdWithTransform()
  faculty: Types.ObjectId

  @ApiProperty({
    description: 'Расписание звонков группы',
    type: CallScheduleItemDto,
    isArray: true,
  })
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CallScheduleItemDto)
  callSchedule: CallScheduleItemDto[]

  @ApiProperty({
    description: 'Стадия обучения группы',
    enum: LearningStage,
  })
  @IsEnum(LearningStage)
  learningStage: LearningStage
}
