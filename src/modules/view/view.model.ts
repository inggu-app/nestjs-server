import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { ViewFieldsEnum } from './view.constants'
import { CustomModelBase } from '../../global/types'

type View = {
  [key in ViewFieldsEnum]: any
}

export interface ViewModel extends CustomModelBase {}
export interface ViewModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<ViewModel>(),
})
export class ViewModel extends TimeStamps implements View {
  @prop()
  code: string

  @prop()
  description: string
}
