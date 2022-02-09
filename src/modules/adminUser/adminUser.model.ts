import { ModelOptions, prop, Ref } from '@typegoose/typegoose'
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { getModelDefaultOptions } from '../../configs/modelDefaultOptions.config'
import { FacultyModel } from '../faculty/faculty.model'

export class Availability {
  @prop({ default: false })
  canCreateFaculty: boolean // можно ли создать факультет

  @prop({ default: false })
  canUpdateFaculty: boolean // можно ли обновить факультет

  @prop({ default: false })
  canDeleteFaculty: boolean // можно ли удалить факультет

  @prop({ default: false })
  canCreateGroup: boolean // можно ли создать группу

  @prop({ default: false })
  canUpdateGroup: boolean // можно ли обновить группу

  @prop({ default: false })
  canDeleteGroup: boolean // можно ли удалить группу

  @prop({ default: false })
  canUpdateCallSchedule: boolean // можно ли обновить расписание звонков

  @prop({ default: false })
  canUpdateSemesterRange: boolean // можно ли обновить длительность семестра
}

export class TokenDataModel {
  constructor(token: string, expiresIn: Date) {
    this.token = token
    this.expiresIn = expiresIn
  }

  @prop()
  token: string

  @prop()
  expiresIn: Date
}

export interface AdminUserModel extends Base {}
@ModelOptions({
  schemaOptions: getModelDefaultOptions<FacultyModel>({
    collection: 'AdminUser',
  }),
})
export class AdminUserModel extends TimeStamps {
  @prop({ required: true })
  name: string

  @prop({ required: true })
  login: string

  @prop({ required: true })
  hashedPassword: string

  @prop({ _id: false, required: true, type: () => Availability })
  availability: Ref<Availability, undefined>

  @prop({ _id: false, required: true, default: [], type: () => TokenDataModel })
  tokens: Ref<TokenDataModel, undefined>[]

  @prop({ default: false })
  isSuper: boolean

  @prop({ default: false })
  isUltraSuper: boolean
}
