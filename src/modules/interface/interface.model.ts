import { Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { CustomModelBase } from '../../global/types'

export interface InterfaceModel extends CustomModelBase {}
export interface InterfaceModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<InterfaceModel>({
    collection: 'Interface',
  }),
})
export class InterfaceModel {
  @prop()
  code: string

  @prop()
  description: string
}
