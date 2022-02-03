import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { modelOptions, prop, Ref } from '@typegoose/typegoose'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { ViewModel } from '../view/view.model'
import { Types } from 'mongoose'
import { TypesEnum } from '../../global/enums/types.enum'
import { AvailableFunctionality } from '../functionality/functionality.constants'
import { DbModelsEnum } from '../../global/enums/dbModelsEnum'

export interface RoleModel extends Base {}
@modelOptions({
  schemaOptions: getModelDefaultOptions<RoleModel>({
    collection: 'Role',
    toJSON: {
      transform: (doc, ret) => {
        if (ret.available) {
          ret.available = (ret.available as Available[]).map(functionality => {
            const res: any = {}
            functionality.data.forEach(item => (res[item.key] = item.value))
            return {
              ...functionality,
              data: res,
            }
          })
        }
      },
    },
    toObject: {
      transform: (doc, ret) => {
        if (ret.available) {
          ret.available = (ret.available as Available[]).map(functionality => {
            const res: any = {}
            functionality.data.forEach(item => (res[item.key] = item.value))
            return {
              ...functionality,
              data: res,
            }
          })
        }
      },
    },
  }),
})
export class RoleModel extends TimeStamps {
  @prop()
  title: string

  @prop()
  code: string

  @prop()
  isVisible: boolean

  @prop({ default: 0 })
  priority: number

  @prop({ default: [], ref: () => ViewModel })
  views: Ref<ViewModel, Types.ObjectId>[]

  @prop({ default: [] })
  available: Available[]

  @prop({ default: {} })
  roleFields: {
    [key: string]: RoleField
  }
}

class RoleField {
  @prop({ enum: TypesEnum })
  type: TypesEnum

  @prop({ type: () => DbModelsEnum || undefined || null, default: null })
  model: DbModelsEnum | undefined | null
}

export class Available implements AvailableFunctionality {
  @prop()
  code: FunctionalityCodesEnum

  @prop({ type: () => AvailableItem })
  data: AvailableItem[]
}

class AvailableItem {
  @prop()
  key: string

  @prop()
  value: any
}
