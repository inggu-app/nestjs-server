import { Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'

export interface UserModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<UserModel>(),
})
export class ViewModel {}
