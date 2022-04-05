import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { GroupModel } from '../../../group.model'
import { MongoIdType, MongoIdExample } from '../../../../../global/constants/constants'
import { CallScheduleItemDto } from '../../callSchedule/updateByFaculty.dto'
import { LearningStage } from '../../../constants/learningStage.constants'

export class GroupModuleResponseGroup implements Partial<GroupModel> {
  @ApiProperty({
    title: 'id группы',
    type: MongoIdType,
    example: MongoIdExample,
    required: false,
  })
  id: Types.ObjectId

  @ApiProperty({
    title: 'Название группы',
    example: 'Группа',
    required: false,
  })
  title: string

  @ApiProperty({
    title: 'id факультета, к которому привязана группа',
    type: MongoIdType,
    example: MongoIdExample,
    required: false,
  })
  faculty: Types.ObjectId

  @ApiProperty({
    title: 'Дата последнего обновления расписания',
    type: Date,
    required: false,
  })
  lastScheduleUpdate: Date

  @ApiProperty({
    title: 'Есть ли расписание у группы',
    required: false,
  })
  isHaveSchedule: boolean

  @ApiProperty({
    title: 'Расписание звонков группы',
    required: false,
    type: CallScheduleItemDto,
    isArray: true,
  })
  callSchedule: CallScheduleItemDto[]

  @ApiProperty({
    title: 'Стадия обучения группы',
    required: false,
    enum: LearningStage,
  })
  learningStage: LearningStage

  @ApiProperty({
    title: 'Дата создания группы',
    type: Date,
    required: false,
  })
  createdAt: Date

  @ApiProperty({
    title: 'Дата последнего обновления группы',
    type: Date,
    required: false,
  })
  updatedAt: Date
}

export class GroupModuleCreateResponseDto {
  @ApiProperty({
    type: GroupModuleResponseGroup,
    required: false,
  })
  group: GroupModuleResponseGroup
}
