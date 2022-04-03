import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { ModelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../../configs/modelDefaultOptions.config'

export interface RoleModel extends Base {}
@ModelOptions({
  schemaOptions: getModelDefaultOptions({
    collection: 'Role',
  }),
})
export class RoleModel extends TimeStamps {
  @prop({ required: true, maxlength: 60 })
  label: string
}
