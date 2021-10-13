import { Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { InterfaceFieldsEnum } from './interface.constants'

type Interface = {
  [key in InterfaceFieldsEnum]: any
}

export interface InterfaceModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<InterfaceModel>(),
})
export class InterfaceModel implements Interface {
  code: string

  description: string
}
