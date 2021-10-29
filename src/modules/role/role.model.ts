import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { RoleFieldsEnum } from './role.constants'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { ViewModel } from '../view/view.model'
import { Types } from 'mongoose'
import { TypesEnum } from '../../global/enums/types.enum'
import { AvailableFunctionality } from '../functionality/functionality.constants'

type Role = {
  [key in RoleFieldsEnum]: any
}

export interface RoleModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<RoleModel>(),
})
export class RoleModel extends TimeStamps implements Role {
  @prop()
  title: string

  @prop()
  code: string

  @prop()
  isVisible: boolean

  @prop({ default: [], ref: () => ViewModel })
  views: Ref<ViewModel, Types.ObjectId>[]

  @prop({ default: [] })
  available: Available[]

  @prop({ default: {} })
  roleFields: {
    [key: string]: TypesEnum
  }

  @prop({ default: 0 })
  priority: number
}

class Available implements AvailableFunctionality {
  @prop()
  code: FunctionalityCodesEnum

  @prop()
  data: {
    [key: string]: any
  }
}
