import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { DeviceId } from '../../global/types'
import { Types } from 'mongoose'
import { LessonModel } from '../schedule/lesson.model'

export interface NoteModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<NoteModel>({
    collection: 'Note',
  }),
})
export class NoteModel extends TimeStamps {
  @prop()
  content: string

  @prop()
  deviceId: DeviceId

  @prop()
  week: number

  @prop({ ref: () => LessonModel })
  lesson: Ref<LessonModel, Types.ObjectId>
}
