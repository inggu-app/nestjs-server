import { modelOptions, prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { NoteFieldsEnum } from './note.constants'
import { DeviceId } from '../../global/types'
import { WeekDaysEnum } from '../../global/enums/WeekDays'
import { GroupModel } from '../group/group.model'
import { Types } from 'mongoose'

type Note = {
  [key in NoteFieldsEnum]: any
}

export interface NoteModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<NoteModel>(),
})
export class NoteModel extends TimeStamps implements Note {
  @prop()
  content: string

  @prop()
  deviceId: DeviceId

  @prop({ ref: () => GroupModel })
  group: Types.ObjectId

  @prop()
  week: number

  @prop({
    enum: [
      WeekDaysEnum.MONDAY,
      WeekDaysEnum.TUESDAY,
      WeekDaysEnum.WEDNESDAY,
      WeekDaysEnum.THURSDAY,
      WeekDaysEnum.FRIDAY,
      WeekDaysEnum.SATURDAY,
      WeekDaysEnum.SUNDAY,
    ],
  })
  weekDay: number

  @prop()
  lessonNumber: number
}
