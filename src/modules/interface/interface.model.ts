import { Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'

export interface InterfaceModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<InterfaceModel>(),
})
export class InterfaceModel {
  code: string

  description: string
}
