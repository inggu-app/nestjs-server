import { Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { InterfaceFieldsEnum } from './interface.constants'
import { CustomModelBase } from '../../global/types'

type Interface = {
  [key in InterfaceFieldsEnum]: any
}

export interface InterfaceModel extends CustomModelBase {}
export interface InterfaceModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<InterfaceModel>(),
})
export class InterfaceModel implements Interface {
  @prop()
  code: string

  @prop()
  description: string
}
