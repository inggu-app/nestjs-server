import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { FacultyFieldsEnum } from './faculty.constants'

type Faculty = {
  [key in FacultyFieldsEnum]: any
}

export interface FacultyModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<FacultyModel>({
    collection: 'Faculty',
  }),
})
export class FacultyModel extends TimeStamps implements Faculty {
  @prop({ unique: true })
  title: string
}
