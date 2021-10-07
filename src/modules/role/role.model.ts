import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { RoleFieldsEnum } from './role.constants'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
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
  functionalities: Functionality[]
}

class Functionality implements AvailableFunctionality {
  @prop()
  code: FunctionalityCodesEnum

  @prop()
  data: {
    [key: string]: any
  }
}
