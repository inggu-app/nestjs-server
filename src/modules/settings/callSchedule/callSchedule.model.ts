import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../../configs/modelDefaultOptions.config'
import { ALL_SETTINGS_TYPES } from '../settings.constants'
import { IsDateString, IsNumber } from 'class-validator'

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
    enum: ALL_SETTINGS_TYPES,
  })
  settingType: string

  @prop()
  schedule: LessonCallSchedule[]

  @prop({ default: true })
  isActive: boolean
}
