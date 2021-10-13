import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { UserFieldsEnum } from './user.constants'
import { RoleModel } from '../role/role.model'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { AvailableFunctionality } from '../functionality/functionality.constants'
import { Types } from 'mongoose'
import { InterfaceModel } from '../interface/interface.model'
import { ViewModel } from '../view/view.model'

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

  @prop({ default: [], ref: () => InterfaceModel })
  interfaces: Ref<InterfaceModel, Types.ObjectId>[]

  @prop({ default: [] })
  available: Available[]

  @prop()
  hashedPassword: string

  @prop()
  hashedUniqueKey: string

  @prop({ default: [], type: () => RoleData })
  roles: RoleData[]

  @prop({ default: [], ref: () => ViewModel })
  views: Ref<ViewModel, Types.ObjectId>[]
}

class Available implements AvailableFunctionality {
  @prop()
  code: FunctionalityCodesEnum

  @prop()
  data: {
    [key: string]: any
  }
}

export class RoleData {
  @prop({ ref: () => RoleModel })
  role: Ref<RoleModel, Types.ObjectId>

  @prop()
  data: {
    [key: string]: any
  }
}
