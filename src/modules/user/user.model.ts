import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { UserFieldsEnum } from './user.constants'
import { Types } from 'mongoose'
import { RoleModel } from '../role/role.model'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { AvailableFunctionality } from '../functionality/functionality.constants'

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

  @prop()
  available: Available[]

  @prop({ ref: () => RoleModel })
  roles: Types.ObjectId[]

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
