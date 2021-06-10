import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../configs/modelDefaultOptions.config'

export interface FacultyModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<FacultyModel>(),
})
export class FacultyModel extends TimeStamps {
  @prop({ unique: true })
  title: string
}
