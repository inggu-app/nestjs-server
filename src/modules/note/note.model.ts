import { modelOptions, prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { NoteFieldsEnum } from './note.constants'
import { DeviceId } from '../../global/types'
import { Types } from 'mongoose'
import { LessonModel } from '../schedule/lesson.model'

type Note = {
  [key in NoteFieldsEnum]: any
}

export interface NoteModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<NoteModel>({
    collection: 'Note',
  }),
})
export class NoteModel extends TimeStamps implements Note {
  @prop()
  content: string

  @prop()
  deviceId: DeviceId

  @prop()
  week: number

  @prop({ ref: () => LessonModel })
  lesson: Types.ObjectId
}
