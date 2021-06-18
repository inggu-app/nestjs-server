import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../../configs/modelDefaultOptions.config'
import {
  CALL_SCHEDULE_TYPE,
  SECRET_LABEL_TYPE,
  SEMESTER_START_TIME_TYPE,
  WEEKS_COUNT_TYPE,
} from '../settings.constants'

export interface SemesterStartDateModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<SemesterStartDateModel>(),
})
export class SemesterStartDateModel extends TimeStamps {
  @prop({
    enum: [CALL_SCHEDULE_TYPE, SECRET_LABEL_TYPE, SEMESTER_START_TIME_TYPE, WEEKS_COUNT_TYPE],
  })
  settingType: string

  @prop()
  date: Date

  @prop()
  isActive: boolean
}
