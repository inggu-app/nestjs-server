import { ModelOptions, prop } from '@typegoose/typegoose'
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { getModelDefaultOptions } from '../../../configs/modelDefaultOptions.config'
import { FacultyModel } from '../../faculty/faculty.model'
import { ClientInterfacesEnum } from '../../../global/enums/ClientInterfaces.enum'
import { RoleModel } from './role.model'
import { GroupModel } from '../../group/group.model'
import { Types } from 'mongoose'
import { UpdateGroupDto } from '../../group/dto/group/updateGroup.dto'
import { UpdateFacultyDto } from '../../faculty/dto/updateFaculty.dto'
import { UpdateUserDto } from '../dto/user/updateUser.dto'
import { UpdateRoleDto } from '../dto/role/updateRole.dto'

// работа с редактированием расписания занятий для группы
export class CreateScheduleAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({ default: false })
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

  @prop({ default: false })
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

  @prop({ default: false })
  learningStage: boolean
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
      learningStage: false,
    },
    _id: false,
  })
  availableFields: UpdateGroupAvailabilityAvailableFieldsModel

  // можно ли обновлять любую группу
  @prop({ default: false })
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
  @prop({ default: false })
  allFacultiesForInstallation: boolean

  @prop({
    ref: FacultyModel,
    default: [],
  })
  availableForInstallationFaculties: (Types.ObjectId | FacultyModel)[]
}

export class UpdateGroupCallScheduleForFacultiesAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({ default: false })
  all: boolean

  @prop({ ref: () => FacultyModel, default: [] })
  availableFaculties: (Types.ObjectId | FacultyModel)[]
}

export class UpdateGroupLearningStageForFacultiesAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({ default: false })
  all: boolean

  @prop({ ref: () => FacultyModel, default: [] })
  availableFaculties: (Types.ObjectId | FacultyModel)[]
}

// работа с удалением групп
export class DeleteGroupAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({ default: false })
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

// работа с созданием факультетов
export class CreateFacultyAvailabilityModel {
  @prop({ default: false })
  available: boolean
}

export class UpdateFacultyAvailabilityAvailableFieldsModel implements Record<keyof Omit<UpdateFacultyDto, 'id'>, boolean> {
  @prop({ default: false })
  title: boolean
}

// работа с обновлением факультетов
export class UpdateFacultyAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({ default: false })
  all: boolean

  @prop({ ref: FacultyModel, default: [] })
  availableFaculties: (Types.ObjectId | FacultyModel)[]

  @prop({
    type: UpdateFacultyAvailabilityAvailableFieldsModel,
    default: <UpdateFacultyAvailabilityAvailableFieldsModel>{
      title: false,
    },
    _id: false,
  })
  availableFields: UpdateFacultyAvailabilityAvailableFieldsModel
}

export class DeleteFacultyAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({ default: false })
  all: boolean

  @prop({ ref: FacultyModel, default: [] })
  availableFaculties: (Types.ObjectId | FacultyModel)[]
}

export class AppVersionAvailabilityModel {
  @prop({ default: false })
  available: boolean
}

// --------
// классы для конфигурации создания пользователя
// --------
export class CreateUserAvailableForInstallationAvailabilitiesModel implements Record<keyof AvailabilitiesModel, boolean> {
  @prop({ default: false })
  createSchedule: boolean

  @prop({ default: false })
  createGroup: boolean

  @prop({ default: false })
  updateGroup: boolean

  @prop({ default: false })
  updateGroupCallScheduleForFaculties: boolean

  @prop({ default: false })
  updateGroupLearningStageForFaculties: boolean

  @prop({ default: false })
  deleteGroup: boolean

  @prop({ default: false })
  createFaculty: boolean

  @prop({ default: false })
  updateFaculty: boolean

  @prop({ default: false })
  deleteFaculty: boolean

  @prop({ default: false })
  appVersion: boolean

  @prop({ default: false })
  createUser: boolean

  @prop({ default: false })
  updateUser: boolean

  @prop({ default: false })
  deleteUser: boolean

  @prop({ default: false })
  updateUserPassword: boolean

  @prop({ default: false })
  updateUserAvailabilities: boolean

  @prop({ default: false })
  createRole: boolean

  @prop({ default: false })
  updateRole: boolean

  @prop({ default: false })
  deleteRole: boolean
}

export class CreateUserAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({ default: Object.values(ClientInterfacesEnum), type: [String] })
  availableForInstallationInterfaces: ClientInterfacesEnum[]

  @prop({
    type: CreateUserAvailableForInstallationAvailabilitiesModel,
    _id: false,
  })
  availableForInstallationAvailabilities: CreateUserAvailableForInstallationAvailabilitiesModel

  @prop({ default: false })
  allRoles: boolean

  @prop({
    ref: RoleModel,
    _id: false,
  })
  availableForInstallationRoles: (Types.ObjectId | RoleModel)[]
}
// --------
// классы для конфигурации создания пользователя
// --------

export class UpdateUserAvailabilityAvailableFieldsModel implements Record<keyof Omit<UpdateUserDto, 'id'>, boolean> {
  @prop({ default: false })
  name: boolean

  @prop({ default: false })
  login: boolean

  @prop({ default: false })
  interfaces: boolean

  @prop({ default: false })
  roles: boolean
}

export class UpdateUserAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({ default: false })
  all: boolean

  @prop({ ref: RoleModel, default: [] })
  availableRoles: (Types.ObjectId | RoleModel)[]

  @prop({ ref: () => UserModel, default: [] })
  availableUsers: (Types.ObjectId | UserModel)[]

  @prop({ ref: () => UserModel, default: [] })
  forbiddenUsers: (Types.ObjectId | UserModel)[]

  @prop({
    type: UpdateUserAvailabilityAvailableFieldsModel,
    _id: false,
  })
  availableFields: UpdateUserAvailabilityAvailableFieldsModel
}

export class DeleteUserAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({ default: false })
  all: boolean

  @prop({ ref: RoleModel, default: [] })
  availableRoles: (Types.ObjectId | RoleModel)[]

  @prop({ ref: () => UserModel, default: [] })
  availableUsers: (Types.ObjectId | UserModel)[]

  @prop({ ref: () => UserModel, default: [] })
  forbiddenUsers: (Types.ObjectId | UserModel)[]
}

export class UpdateUserPasswordAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({ default: false })
  self: boolean

  @prop({ default: false })
  all: boolean

  @prop({ ref: RoleModel, default: [] })
  availableRoles: (Types.ObjectId | RoleModel)[]

  @prop({ ref: () => UserModel, default: [] })
  availableUsers: (Types.ObjectId | UserModel)[]

  @prop({ ref: () => UserModel, default: [] })
  forbiddenUsers: (Types.ObjectId | UserModel)[]
}

export class UpdateUserAvailabilitiesAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({
    type: CreateUserAvailableForInstallationAvailabilitiesModel,
    _id: false,
  })
  availableForInstallationAvailabilities: CreateUserAvailableForInstallationAvailabilitiesModel

  @prop({ default: false })
  all: boolean

  @prop({ ref: RoleModel, default: [] })
  availableRoles: (Types.ObjectId | RoleModel)[]

  @prop({ ref: () => UserModel, default: [] })
  availableUsers: (Types.ObjectId | UserModel)[]

  @prop({ ref: () => UserModel, default: [] })
  forbiddenUsers: (Types.ObjectId | UserModel)[]
}

export class CreateRoleAvailabilityModel {
  @prop({ default: false })
  available: boolean
}

export class UpdateRoleAvailabilityAvailableFieldsModel implements Record<keyof Omit<UpdateRoleDto, 'id'>, boolean> {
  @prop({ default: false })
  label: boolean
}

export class UpdateRoleAvailabilityModel {
  @prop({ default: false })
  available: boolean

  @prop({
    type: UpdateRoleAvailabilityAvailableFieldsModel,
    default: <UpdateRoleAvailabilityAvailableFieldsModel>{
      label: false,
    },
    _id: false,
  })
  availableFields: UpdateRoleAvailabilityAvailableFieldsModel

  @prop({ default: false })
  all: boolean

  @prop({ ref: RoleModel, default: [] })
  availableRoles: (Types.ObjectId | RoleModel)[]
}

export class DeleteRoleAvailabilityModel {
  @prop({ default: false })
  available: boolean
}

export class AvailabilitiesModel {
  @prop({
    type: CreateScheduleAvailabilityModel,
    default: <CreateScheduleAvailabilityModel>{
      available: false,
      all: false,
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
      allFaculties: false,
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
        learningStage: false,
      },
      allForUpdate: false,
      availableForUpdateFaculties: [],
      availableGroups: [],
      forbiddenGroups: [],
      allFacultiesForInstallation: false,
      availableForInstallationFaculties: [],
    },
    _id: false,
  })
  updateGroup: UpdateGroupAvailabilityModel

  @prop({
    type: UpdateGroupCallScheduleForFacultiesAvailabilityModel,
    default: <UpdateGroupCallScheduleForFacultiesAvailabilityModel>{
      available: false,
      all: false,
      availableFaculties: [],
    },
    _id: false,
  })
  updateGroupCallScheduleForFaculties: UpdateGroupCallScheduleForFacultiesAvailabilityModel

  @prop({
    type: UpdateGroupLearningStageForFacultiesAvailabilityModel,
    default: <UpdateGroupLearningStageForFacultiesAvailabilityModel>{
      available: false,
      all: false,
      availableFaculties: [],
    },
    _id: false,
  })
  updateGroupLearningStageForFaculties: UpdateGroupLearningStageForFacultiesAvailabilityModel

  @prop({
    type: DeleteGroupAvailabilityModel,
    default: <DeleteGroupAvailabilityModel>{
      available: false,
      all: false,
      availableFaculties: [],
      availableGroups: [],
      forbiddenGroups: [],
    },
    _id: false,
  })
  deleteGroup: DeleteGroupAvailabilityModel

  @prop({
    type: CreateFacultyAvailabilityModel,
    default: <CreateFacultyAvailabilityModel>{
      available: false,
    },
    _id: false,
  })
  createFaculty: CreateFacultyAvailabilityModel

  @prop({
    type: UpdateFacultyAvailabilityModel,
    default: <UpdateFacultyAvailabilityModel>{
      available: false,
      all: false,
      availableFaculties: [],
      availableFields: {
        title: false,
      },
    },
    _id: false,
  })
  updateFaculty: UpdateFacultyAvailabilityModel

  @prop({
    type: DeleteFacultyAvailabilityModel,
    default: <DeleteFacultyAvailabilityModel>{
      available: false,
      all: false,
      availableFaculties: [],
    },
    _id: false,
  })
  deleteFaculty: DeleteFacultyAvailabilityModel

  @prop({
    type: AppVersionAvailabilityModel,
    default: <AppVersionAvailabilityModel>{
      available: false,
    },
    _id: false,
  })
  appVersion: AppVersionAvailabilityModel

  @prop({
    type: CreateUserAvailabilityModel,
    default: <CreateUserAvailabilityModel>{
      available: false,
      availableForInstallationInterfaces: Object.values(ClientInterfacesEnum),
      availableForInstallationAvailabilities: {
        createSchedule: false,
        createGroup: false,
        updateGroup: false,
        updateGroupCallScheduleForFaculties: false,
        updateGroupLearningStageForFaculties: false,
        deleteGroup: false,
        createFaculty: false,
        updateFaculty: false,
        deleteFaculty: false,

        updateCallSchedule: false,
        deleteCallSchedule: false,
        appVersion: false,
        learningStage: false,
        createUser: false,
        updateUser: false,
        deleteUser: false,
        updateUserPassword: false,
        updateUserAvailabilities: false,
        createRole: false,
        updateRole: false,
        deleteRole: false,
      },
      allRoles: false,
      availableForInstallationRoles: [],
    },
    _id: false,
  })
  createUser: CreateUserAvailabilityModel

  @prop({
    type: UpdateUserAvailabilityModel,
    default: <UpdateUserAvailabilityModel>{
      available: false,
      all: false,
      forbiddenUsers: [],
      availableUsers: [],
      availableRoles: [],
      availableFields: {
        name: false,
        login: false,
        interfaces: false,
        roles: false,
      },
    },
    _id: false,
  })
  updateUser: UpdateUserAvailabilityModel

  @prop({
    type: DeleteUserAvailabilityModel,
    default: <DeleteUserAvailabilityModel>{
      available: false,
      all: false,
      availableRoles: [],
      availableUsers: [],
      forbiddenUsers: [],
    },
    _id: false,
  })
  deleteUser: DeleteUserAvailabilityModel

  @prop({
    type: UpdateUserPasswordAvailabilityModel,
    default: <UpdateUserPasswordAvailabilityModel>{
      available: false,
      self: false,
      all: false,
      availableRoles: [],
      availableUsers: [],
      forbiddenUsers: [],
    },
    _id: false,
  })
  updateUserPassword: UpdateUserPasswordAvailabilityModel

  @prop({
    type: UpdateUserAvailabilitiesAvailabilityModel,
    default: <UpdateUserAvailabilitiesAvailabilityModel>{
      available: false,
      all: false,
      availableForInstallationAvailabilities: {
        createSchedule: false,
        createGroup: false,
        updateGroup: false,
        updateGroupCallScheduleForFaculties: false,
        updateGroupLearningStageForFaculties: false,
        deleteGroup: false,
        createFaculty: false,
        updateFaculty: false,
        deleteFaculty: false,
        appVersion: false,
        createUser: false,
        updateUser: false,
        deleteUser: false,
        updateUserPassword: false,
        updateUserAvailabilities: false,
        createRole: false,
        updateRole: false,
        deleteRole: false,
      },
      availableRoles: [],
      availableUsers: [],
      forbiddenUsers: [],
    },
    _id: false,
  })
  updateUserAvailabilities: UpdateUserAvailabilitiesAvailabilityModel

  @prop({
    type: CreateRoleAvailabilityModel,
    default: <CreateRoleAvailabilityModel>{
      available: false,
    },
    _id: false,
  })
  createRole: CreateRoleAvailabilityModel

  @prop({
    type: UpdateRoleAvailabilityModel,
    default: <UpdateRoleAvailabilityModel>{
      available: false,
      all: false,
      availableFields: {
        label: false,
      },
      availableRoles: [],
    },
    _id: false,
  })
  updateRole: UpdateRoleAvailabilityModel

  @prop({
    type: DeleteRoleAvailabilityModel,
    default: <DeleteRoleAvailabilityModel>{
      available: false,
    },
    _id: false,
  })
  deleteRole: DeleteRoleAvailabilityModel
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

  @prop({ _id: false, required: true, type: () => AvailabilitiesModel })
  availabilities: AvailabilitiesModel

  @prop({ _id: false, required: true, default: [], type: () => TokenDataModel })
  tokens: (Types.ObjectId | TokenDataModel)[]

  @prop({ ref: RoleModel, default: [] })
  roles: (Types.ObjectId | RoleModel)[]
}
