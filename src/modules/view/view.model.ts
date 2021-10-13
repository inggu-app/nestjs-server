import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { ViewFieldsEnum } from './view.constants'

type View = {
  [key in ViewFieldsEnum]: any
}

export interface UserModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<ViewModel>(),
})
export class ViewModel extends TimeStamps implements View {
  @prop()
  code: string

  @prop()
  description: string
}
