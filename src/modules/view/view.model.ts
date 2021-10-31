import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { ViewFieldsEnum } from './view.constants'
import { CustomModelBase } from '../../global/types'
import { InterfaceModel } from '../interface/interface.model'
import { Types } from 'mongoose'

type View = {
  [key in ViewFieldsEnum]: any
}

export interface ViewModel extends CustomModelBase {}
export interface ViewModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<ViewModel>({
    collection: 'View',
  }),
})
export class ViewModel extends TimeStamps implements View {
  @prop()
  code: string

  @prop({ ref: () => InterfaceModel })
  interface: Ref<InterfaceModel, Types.ObjectId>

  @prop()
  description: string
}
