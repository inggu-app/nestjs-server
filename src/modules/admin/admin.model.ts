import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { AdminFieldsEnum } from './admin.constants'

type Admin = {
  [key in AdminFieldsEnum]: any
}

export interface AdminModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<AdminModel>(),
})
export class AdminModel extends TimeStamps implements Admin {
  @prop()
  name: string

  @prop()
  login: string

  @prop()
  hashedUniqueKey: string

  @prop()
  hashedPassword: string
}
