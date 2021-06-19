import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../../configs/modelDefaultOptions.config'
import {
  CALL_SCHEDULE_TYPE,
  SECRET_LABEL_TYPE,
  SEMESTER_START_TIME_TYPE,
  WEEKS_COUNT_TYPE,
} from '../settings.constants'
import { IsDateString, IsNumber } from 'class-validator'
import { Schema, Types } from 'mongoose'

interface Lesson {
  lessonNumber: number

  start: Date

  end: Date
}
export class LessonCallSchedule {
  @IsNumber()
  lessonNumber: number

  @IsDateString()
  start: Date

  @IsDateString()
  end: Date
}

export interface CallScheduleModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<CallScheduleModel>(),
})
export class CallScheduleModel extends TimeStamps {
  @prop({
    enum: [CALL_SCHEDULE_TYPE, SECRET_LABEL_TYPE, SEMESTER_START_TIME_TYPE, WEEKS_COUNT_TYPE],
  })
  settingType: string

  @prop()
  schedule: LessonCallSchedule[]

  @prop({ default: true })
  isActive: boolean
}
