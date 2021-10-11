import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { UserFieldsEnum } from './user.constants'
import { RoleModel } from '../role/role.model'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { AvailableFunctionality } from '../functionality/functionality.constants'
import { Types } from 'mongoose'

type User = {
  [key in UserFieldsEnum]: any
}

export interface UserModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<UserModel>(),
})
export class UserModel extends TimeStamps implements User {
  @prop()
  name: string

  @prop()
  login: string

  @prop({ default: [] })
  available: Available[]

  @prop({ ref: () => RoleModel, default: [] })
  roles: Ref<RoleModel, Types.ObjectId>[]

  @prop()
  hashedPassword: string

  @prop()
  hashedUniqueKey: string
}

class Available implements AvailableFunctionality {
  @prop()
  code: FunctionalityCodesEnum

  @prop()
  data: {
    [key: string]: any
  }
}
