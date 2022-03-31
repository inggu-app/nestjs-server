import { ModelOptions, prop, Ref } from '@typegoose/typegoose'
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { getModelDefaultOptions } from '../../../configs/modelDefaultOptions.config'
import { FacultyModel } from '../../faculty/faculty.model'
import { ClientInterfacesEnum } from '../../../global/enums/ClientInterfaces.enum'
import { RoleModel } from './role.model'
import { GroupModel } from '../../group/group.model'
import { Types } from 'mongoose'
import { UpdateGroupDto } from '../../group/dto/updateGroup.dto'

// работа с редактированием расписания занятий для группы
export class CreateScheduleAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({ default: true })
  all: boolean

  @prop({ ref: FacultyModel, default: [] })
  availableFaculties: (Types.ObjectId | FacultyModel)[]

  @prop({ ref: GroupModel, default: [] })
  availableGroups: (Types.ObjectId | GroupModel)[]

  @prop({ ref: GroupModel, default: [] })
  forbiddenGroups: (Types.ObjectId | GroupModel)[]
}

// работа с созданием групп
export class CreateGroupAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({ default: true })
  allFaculties: boolean

  @prop({ ref: FacultyModel, default: [] })
  availableFaculties: (Types.ObjectId | FacultyModel)[]
}

// доступность полей для обновления группы. Относится к UpdateGroupAvailabilityModel
export class UpdateGroupAvailabilityAvailableFieldsModel implements Record<keyof Omit<UpdateGroupDto, 'id'>, boolean> {
  @prop({ default: false })
  title: boolean

  @prop({ default: false })
  faculty: boolean

  @prop({ default: false })
  callSchedule: boolean
}

// работа с обновлением групп
export class UpdateGroupAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({
    type: UpdateGroupAvailabilityAvailableFieldsModel,
    default: <UpdateGroupAvailabilityAvailableFieldsModel>{
      title: false,
      faculty: false,
      callSchedule: false,
    },
    _id: false,
  })
  availableFields: UpdateGroupAvailabilityAvailableFieldsModel

  // можно ли обновлять любую группу
  @prop({ default: true })
  allForUpdate: boolean

  @prop({
    ref: FacultyModel,
    default: [],
  })
  availableForUpdateFaculties: (Types.ObjectId | FacultyModel)[]

  @prop({
    ref: GroupModel,
    default: [],
  })
  availableGroups: (Types.ObjectId | GroupModel)[]

  @prop({
    ref: GroupModel,
    default: [],
  })
  forbiddenGroups: (Types.ObjectId | GroupModel)[]

  // факультеты, на которые можно обновить принадлежность группы
  @prop({ default: true })
  allFacultiesForInstallation: boolean

  @prop({
    ref: FacultyModel,
    default: [],
  })
  availableForInstallationFaculties: (Types.ObjectId | FacultyModel)[]
}

// работа с удалением групп
export class DeleteGroupAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({ default: true })
  all: boolean

  @prop({
    ref: FacultyModel,
    default: [],
  })
  availableFaculties: (Types.ObjectId | FacultyModel)[]

  @prop({
    ref: GroupModel,
    default: [],
  })
  availableGroups: (Types.ObjectId | GroupModel)[]

  @prop({
    ref: GroupModel,
    default: [],
  })
  forbiddenGroups: (Types.ObjectId | GroupModel)[]
}

export class AvailabilityModel {
  @prop({
    type: CreateScheduleAvailabilityModel,
    default: <CreateScheduleAvailabilityModel>{
      available: false,
      all: true,
      availableFaculties: [],
      availableGroups: [],
      forbiddenGroups: [],
    },
    _id: false,
  })
  createSchedule: CreateScheduleAvailabilityModel

  @prop({
    type: CreateGroupAvailabilityModel,
    default: <CreateGroupAvailabilityModel>{
      available: false,
      allFaculties: true,
      availableFaculties: [],
    },
    _id: false,
  })
  createGroup: CreateGroupAvailabilityModel

  @prop({
    type: UpdateGroupAvailabilityModel,
    default: <UpdateGroupAvailabilityModel>{
      available: false,
      availableFields: {
        title: false,
        faculty: false,
        callSchedule: false,
      },
    },
    _id: false,
  })
  updateGroup: UpdateGroupAvailabilityModel

  @prop({
    type: DeleteGroupAvailabilityModel,
    default: <DeleteGroupAvailabilityModel>{
      available: false,
      all: true,
      availableFaculties: [],
      availableGroups: [],
      forbiddenGroups: [],
    },
    _id: false,
  })
  deleteGroup: DeleteGroupAvailabilityModel
  //
  // @prop({ default: false })
  // canUpdateFaculty: boolean // можно ли обновить факультет
  //
  // @prop({ default: false })
  // canDeleteFaculty: boolean // можно ли удалить факультет
  //
  // @prop({ default: false })
  // canCreateGroup: boolean // можно ли создать группу
  //
  // @prop({ default: false })
  // canUpdateGroup: boolean // можно ли обновить группу
  //
  // @prop({ default: false })
  // canDeleteGroup: boolean // можно ли удалить группу
  //
  // @prop({ default: false })
  // canUpdateCallSchedule: boolean // можно ли обновить расписание звонков
  //
  // @prop({ default: false })
  // canUpdateSemesterRange: boolean // можно ли обновить длительность семестра
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

export interface UserModel extends Base {}
@ModelOptions({
  schemaOptions: getModelDefaultOptions<FacultyModel>({
    collection: 'User',
  }),
})
export class UserModel extends TimeStamps {
  @prop({ required: true })
  name: string

  @prop({ required: true })
  login: string

  @prop({ default: [], type: [String] })
  interfaces: ClientInterfacesEnum[]

  @prop({ required: true })
  hashedPassword: string

  @prop({ _id: false, required: true, type: () => AvailabilityModel })
  availability: AvailabilityModel

  @prop({ _id: false, required: true, default: [], type: () => TokenDataModel })
  tokens: Ref<TokenDataModel, undefined>[]

  @prop({ ref: RoleModel, default: [] })
  roles: Ref<RoleModel, undefined>[]
}
