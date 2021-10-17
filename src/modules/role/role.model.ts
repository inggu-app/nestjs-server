import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { RoleFieldsEnum } from './role.constants'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { ViewModel } from '../view/view.model'
import { Types } from 'mongoose'
import { TypesEnum } from '../../global/enums/types.enum'

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

  @prop({ default: [], ref: () => ViewModel })
  views: Ref<ViewModel, Types.ObjectId>[]

  @prop()
  available: FunctionalityCodesEnum[]

  @prop()
  roleFields: {
    [key: string]: TypesEnum
  }
}
