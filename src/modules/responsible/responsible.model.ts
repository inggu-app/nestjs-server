import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { GroupModel } from '../group/group.model'
import { Types } from 'mongoose'
import { ResponsibleFieldsEnum } from './responsible.constants'

type Responsible = {
  [key in ResponsibleFieldsEnum]: any
}

export interface ResponsibleModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<ResponsibleModel>(),
})
export class ResponsibleModel extends TimeStamps implements Responsible {
  @prop({ ref: () => GroupModel })
  groups: Types.ObjectId[]

  @prop()
  name: string

  @prop()
  hashedUniqueKey: string

  @prop({ unique: true })
  login: string

  @prop()
  hashedPassword: string
}
