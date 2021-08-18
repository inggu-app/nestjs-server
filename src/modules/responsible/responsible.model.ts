import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { GroupModel } from '../group/group.model'
import { Types } from 'mongoose'

export interface FacultyModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<ResponsibleModel>(),
})
export class ResponsibleModel extends TimeStamps {
  @prop({ ref: () => GroupModel })
  groups: Types.ObjectId[]

  @prop()
  name: string

  @prop()
  hashedUniqueKey: string

  @prop()
  login: string

  @prop()
  hashedPassword: string
}
