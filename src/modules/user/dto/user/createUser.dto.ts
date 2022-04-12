import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsObject, IsString, MaxLength, ValidateNested } from 'class-validator'
import {
  AppVersionAvailabilityModel,
  AvailabilitiesModel,
  CreateFacultyAvailabilityModel,
  CreateGroupAvailabilityModel,
  CreateRoleAvailabilityModel,
  CreateScheduleAvailabilityModel,
  CreateUserAvailabilityModel,
  CreateUserAvailableForInstallationAvailabilitiesModel,
  DeleteFacultyAvailabilityModel,
  DeleteGroupAvailabilityModel,
  DeleteRoleAvailabilityModel,
  DeleteUserAvailabilityModel,
  UpdateFacultyAvailabilityAvailableFieldsModel,
  UpdateFacultyAvailabilityModel,
  UpdateGroupAvailabilityAvailableFieldsModel,
  UpdateGroupAvailabilityModel,
  UpdateGroupCallScheduleForFacultiesAvailabilityModel,
  UpdateGroupLearningStageForFacultiesAvailabilityModel,
  UpdateRoleAvailabilityAvailableFieldsModel,
  UpdateRoleAvailabilityModel,
  UpdateUserAvailabilitiesAvailabilityModel,
  UpdateUserAvailabilityAvailableFieldsModel,
  UpdateUserAvailabilityModel,
  UpdateUserPasswordAvailabilityModel,
  UserModel,
} from '../../models/user.model'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { ClientInterfacesEnum } from '../../../../global/enums/ClientInterfaces.enum'
import { Types } from 'mongoose'
import { MongoIdExample, MongoIdType } from '../../../../global/constants/constants'
import { IsUndefinable } from '../../../../global/decorators/isUndefinable.decorator'
import { IsMongoIdWithTransform } from '../../../../global/decorators/IsMongoIdWithTransform.decorator'
import { CheckExists } from '../../../../global/decorators/CheckExists.decorator'
import { FacultyModel } from '../../../faculty/faculty.model'
import { GroupModel } from '../../../group/group.model'
import { RoleModel } from '../../models/role.model'

export class CreateScheduleAvailabilityDto implements CreateScheduleAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description:
      'Разрешены ли пользователю для редактирования расписания всех групп. Если true, то пользователь может редактировать любое расписание. Если false, то не все и следует ориентироваться на поля availableFaculties, availableGroups, forbiddenGroups',
  })
  @IsBoolean()
  all: boolean

  @ApiProperty({
    description:
      'Список доступных для редактирования факультетов. Расписания всех групп, которые относятся к этим факультетам доступны к редактированию. Важно только если в поле all стоит false',
    type: MongoIdType,
    example: [MongoIdExample],
    isArray: true,
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(FacultyModel, true)
  availableFaculties: Types.ObjectId[]

  @ApiProperty({
    description:
      'Список доступных для редактирования групп. Расписания этих групп доступны для редактирования. Нужно если мы хотим разрешить отдельные группы. Важно только если в поле all стоит false',
    type: MongoIdType,
    example: [MongoIdExample],
    isArray: true,
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(GroupModel, true)
  availableGroups: Types.ObjectId[]

  @ApiProperty({
    description:
      'Список запрещённых для редактирования групп. Расписания этих групп запрещены для редактирования, даже если эти группы относятся к разрешённым факультетам или если они содержатся в списке разрешённых групп. Важно только если в поле all стоит false',
    type: MongoIdType,
    example: [MongoIdExample],
    isArray: true,
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(GroupModel, true)
  forbiddenGroups: Types.ObjectId[]
}

export class CreateGroupAvailabilityDto implements CreateGroupAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description:
      'Доступность создания группы для любых факультетов. Если true, то пользователь может создать группу для любого факультета. Если false, то только для факультетов из availableFaculties',
  })
  @IsBoolean()
  allFaculties: boolean

  @ApiProperty({
    description: 'Список факультетов, для которых можно создать группу. Имеет смысл только есть в поле allFaculties стоит значение false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(FacultyModel, true)
  availableFaculties: Types.ObjectId[]
}

class UpdateGroupAvailabilityAvailableFieldsDto implements UpdateGroupAvailabilityAvailableFieldsModel {
  @ApiProperty({
    description: 'Может ли пользователь обновлять названия группы',
  })
  @IsBoolean()
  title: boolean

  @ApiProperty({
    description: 'Может ли пользователь обновлять принадлежность группы к факультету',
  })
  @IsBoolean()
  faculty: boolean

  @ApiProperty({
    description: 'Может ли пользователь обновлять расписания звонков групп',
  })
  @IsBoolean()
  callSchedule: boolean

  @ApiProperty({
    description: 'Может ли пользователь обновлять стадии обучения групп',
  })
  @IsBoolean()
  learningStage: boolean
}

export class UpdateGroupAvailabilityDto implements UpdateGroupAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description: 'Поля, которые может обновлять пользователь',
    type: UpdateGroupAvailabilityAvailableFieldsDto,
    example: <UpdateGroupAvailabilityAvailableFieldsDto>{
      title: true,
      faculty: false,
      callSchedule: false,
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateGroupAvailabilityAvailableFieldsDto)
  availableFields: UpdateGroupAvailabilityAvailableFieldsDto

  @ApiProperty({
    description:
      'Доступны ли все группы для обновления. Если стоит true, то любая группа доступна для обновления. Если стоит false, то следует обращать внимание на поля availableForUpdateFaculties, availableGroups, forbiddenGroups',
  })
  @IsBoolean()
  allForUpdate: boolean

  @ApiProperty({
    description: 'Список факультетов, группы которых можно обновлять. Имеет смысл только если в allForUpdate стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(FacultyModel, true)
  availableForUpdateFaculties: Types.ObjectId[]

  @ApiProperty({
    description: 'Список групп, которые можно обновлять. Имеет смысл только если в allForUpdate стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(GroupModel, true)
  availableGroups: Types.ObjectId[]

  @ApiProperty({
    description: 'Список групп, которые запрещено обновлять. Имеет смысл только если в allForUpdate стоит false',
    type: MongoIdType,
    isArray: false,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(GroupModel, true)
  forbiddenGroups: Types.ObjectId[]

  @ApiProperty({
    description:
      'Доступны ли для установки в поле faculty все факультеты. Не путать с полей allForUpdate. Данная настройка позволяет конфигурировать факультеты, которые можно назначить группе, но не позволяет конфигурировать факультеты, группы которых можно редактировать(за это отвечает allForUpdate)',
  })
  @IsBoolean()
  allFacultiesForInstallation: boolean

  @ApiProperty({
    description:
      'Список групп, которые можно устанавливать в поле faculty. Как и поле allFacultiesForInstallation, оно отличается от availableForUpdateFaculties. Имеет смысл только если в allFacultiesForInstallation стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(FacultyModel, true)
  availableForInstallationFaculties: Types.ObjectId[]
}

export class UpdateGroupCallScheduleForFacultiesAvailabilityDto implements UpdateGroupCallScheduleForFacultiesAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description:
      'Доступны ли пользователю обновления расписания звонков для групп всех факультетов. Если стоит true, то можно обновлять расписание звонков для всех факультетов. Если стоит false, то следует обращать внимание на поле availableFaculties',
  })
  @IsBoolean()
  all: boolean

  @ApiProperty({
    description: 'Доступные для обновления расписания звонков факультеты. Имеет смысл только если в all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(FacultyModel, true)
  availableFaculties: Types.ObjectId[]
}

export class UpdateGroupLearningStageForFacultiesAvailabilityDto implements UpdateGroupLearningStageForFacultiesAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description:
      'Доступны ли пользователю обновления стадию обучения для групп всех факультетов. Если стоит true, то можно обновлять стадию обучения для всех факультетов. Если стоит false, то следует обращать внимание на поле availableFaculties',
  })
  @IsBoolean()
  all: boolean

  @ApiProperty({
    description: 'Доступные для обновления стадии обучения факультеты. Имеет смысл только если в all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(FacultyModel, true)
  availableFaculties: Types.ObjectId[]
}

export class DeleteGroupAvailabilityDto implements DeleteGroupAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description:
      'Доступны ли пользователю для удаления все группы. Если стоит true, то пользователь может удалить любую группу. Если стоит false, то следует опираться на поля ',
  })
  @IsBoolean()
  all: boolean

  @ApiProperty({
    description: 'Список факультетов, группы которых можно удалять. Имеет смысл только если в поле all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(FacultyModel, true)
  availableFaculties: Types.ObjectId[]

  @ApiProperty({
    description: 'Список групп, которые можно удалять. Имеет смысл только если в поле all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(GroupModel, true)
  availableGroups: Types.ObjectId[]

  @ApiProperty({
    description: 'Список групп, которые нельзя удалить. Имеет смысл только если в поле all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(GroupModel, true)
  forbiddenGroups: Types.ObjectId[]
}

export class CreateFacultyAvailabilityDto implements CreateFacultyAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean
}

export class UpdateFacultyAvailabilityAvailableFieldsDto implements UpdateFacultyAvailabilityAvailableFieldsModel {
  @ApiProperty({
    description: 'Может ли пользователь редактировать название факультета',
  })
  @IsBoolean()
  title: boolean
}

export class UpdateFacultyAvailabilityDto implements UpdateFacultyAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description:
      'Доступны ли пользователю для обновления все факультеты. Если стоит true, то доступны все факультеты. Если стоит false, то нужно опираться на список в поле availableFaculties',
  })
  @IsBoolean()
  all: boolean

  @ApiProperty({
    description: 'Список разрешённых для редактирования факультетов. Имеет значение только если в all стоит значение false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(FacultyModel, true)
  availableFaculties: Types.ObjectId[]

  @ApiProperty({
    description: 'Доступные для редактирования поля факультета.',
    type: UpdateFacultyAvailabilityAvailableFieldsDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateFacultyAvailabilityAvailableFieldsDto)
  availableFields: UpdateFacultyAvailabilityAvailableFieldsDto
}

export class DeleteFacultyAvailabilityDto implements DeleteFacultyAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description:
      'Доступны ли пользователю для удаления все факультеты. Если стоит true, то доступны все факультеты. Если стоит false, то нужно опираться на список в поле availableFaculties',
  })
  @IsBoolean()
  all: boolean

  @ApiProperty({
    description: 'Список разрешённых для удаления факультетов. Имеет значение только если в all стоит значение false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(FacultyModel, true)
  availableFaculties: Types.ObjectId[]
}

export class AppVersionAvailabilityDto implements AppVersionAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean
}

export class CreateUserAvailableForInstallationAvailabilitiesDto implements CreateUserAvailableForInstallationAvailabilitiesModel {
  @ApiProperty({
    description: 'Может ли пользователь редактировать расписание занятий',
  })
  @IsBoolean()
  createSchedule: boolean

  @ApiProperty({
    description: 'Может ли пользователь создавать группы',
  })
  @IsBoolean()
  createGroup: boolean

  @ApiProperty({
    description: 'Может ли пользователь обновлять группы',
  })
  @IsBoolean()
  updateGroup: boolean

  @ApiProperty({
    description: 'Может ли пользователь обновлять расписание звонков для групп, принадлежащих факультетам',
  })
  @IsBoolean()
  updateGroupCallScheduleForFaculties: boolean

  @ApiProperty({
    description: 'Может ли пользователь обновлять стадию обучения для групп, принадлежащих факультетам',
  })
  @IsBoolean()
  updateGroupLearningStageForFaculties: boolean

  @ApiProperty({
    description: 'Может ли пользователь удалять группы',
  })
  @IsBoolean()
  deleteGroup: boolean

  @ApiProperty({
    description: 'Может ли пользователь создавать факультеты',
  })
  @IsBoolean()
  createFaculty: boolean

  @ApiProperty({
    description: 'Может ли пользователь обновлять факультеты',
  })
  @IsBoolean()
  updateFaculty: boolean

  @ApiProperty({
    description: 'Может ли пользователь удалять факультеты',
  })
  @IsBoolean()
  deleteFaculty: boolean

  @ApiProperty({
    description: 'Может ли пользователь создавать расписания звонков',
  })
  @IsBoolean()
  createCallSchedule: boolean

  @ApiProperty({
    description: 'Может ли пользователь обновлять расписания звонков',
  })
  @IsBoolean()
  updateCallSchedule: boolean

  @ApiProperty({
    description: 'Может ли пользователь удалять расписания звонков',
  })
  @IsBoolean()
  deleteCallSchedule: boolean

  @ApiProperty({
    description: 'Может ли пользователь работать с версиями приложений',
  })
  @IsBoolean()
  appVersion: boolean

  @ApiProperty({
    description: 'Может ли пользователь работать со стадиями обучения',
  })
  @IsBoolean()
  learningStage: boolean

  @ApiProperty({
    description: 'Может ли пользователь создавать пользователей',
  })
  @IsBoolean()
  createUser: boolean

  @ApiProperty({
    description: 'Может ли пользователь обновлять пользователей',
  })
  @IsBoolean()
  updateUser: boolean

  @ApiProperty({
    description: 'Может ли пользователь удалять пользователей',
  })
  @IsBoolean()
  deleteUser: boolean

  @ApiProperty({
    description: 'Может ли пользователь обновлять пароли пользователей',
  })
  @IsBoolean()
  updateUserPassword: boolean

  @ApiProperty({
    description: 'Может ли пользователь обновлять возможности пользователей',
  })
  @IsBoolean()
  updateUserAvailabilities: boolean

  @ApiProperty({
    description: 'Может ли пользователь создавать роли',
  })
  @IsBoolean()
  createRole: boolean

  @ApiProperty({
    description: 'Может ли пользователь обновлять роли',
  })
  @IsBoolean()
  updateRole: boolean

  @ApiProperty({
    description: 'Может ли пользователь удалять роли',
  })
  @IsBoolean()
  deleteRole: boolean
}

export class CreateUserAvailabilityDto implements CreateUserAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description: 'Список интерфейсов, которые пользовать может назначать новосоздаваемому пользователю',
    isArray: true,
    enum: ClientInterfacesEnum,
    example: [ClientInterfacesEnum.MAIN_MOBILE_APP],
  })
  @IsArray()
  @IsEnum(ClientInterfacesEnum, { each: true })
  availableForInstallationInterfaces: ClientInterfacesEnum[]

  @ApiProperty({
    description: 'Возможности, которые пользователь может назначать новосоздаваемому пользователю',
    type: CreateUserAvailableForInstallationAvailabilitiesDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserAvailableForInstallationAvailabilitiesDto)
  availableForInstallationAvailabilities: CreateUserAvailableForInstallationAvailabilitiesDto

  @ApiProperty({
    description:
      'Может ли пользователь при создании нового пользователя назначать ему любые роли. Если стоит true, то можно назначить любую роль. Если стоит false, то следует обращать внимание на поле availableForInstallationRoles',
  })
  @IsBoolean()
  allRoles: boolean

  @ApiProperty({
    description: 'Список ролей, которые пользователь может назначать новосоздаваемому пользователю',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(RoleModel, true)
  availableForInstallationRoles: Types.ObjectId[]
}

export class UpdateUserAvailabilityAvailableFieldsDto implements UpdateUserAvailabilityAvailableFieldsModel {
  @ApiProperty({
    description: 'Может ли пользователь редактировать имя другого пользователя',
  })
  @IsBoolean()
  name: boolean

  @ApiProperty({
    description: 'Может ли пользователь редактировать логин другого пользователя',
  })
  @IsBoolean()
  login: boolean

  @ApiProperty({
    description: 'Может ли пользователь редактировать присвоенные пользователю интерфейсы',
  })
  @IsBoolean()
  interfaces: boolean

  @ApiProperty({
    description: 'Может ли пользователь редактировать присвоенные пользователю роли',
  })
  @IsBoolean()
  roles: boolean
}

export class UpdateUserAvailabilityDto implements UpdateUserAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description:
      'Может ли пользователь обновлять любых пользователей. Если стоит true, то может обновить любого. Если стоит false, то следует обращать внимание на другие параметры',
  })
  @IsBoolean()
  all: boolean

  @ApiProperty({
    description: 'Список ролей, пользователей с которыми может редактировать пользователь',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(RoleModel, true)
  availableRoles: Types.ObjectId[]

  @ApiProperty({
    description: 'Список пользователей, которых может редактировать пользователь. Имеет смысл только если в поле all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(UserModel, true)
  availableUsers: Types.ObjectId[]

  @ApiProperty({
    description: 'Список пользователей, которых пользователь не может редактировать. Имеет смысл только если в поле all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(UserModel, true)
  forbiddenUsers: Types.ObjectId[]

  @ApiProperty({
    description: 'Поля пользователя, которые может редактировать пользователь',
    type: UpdateUserAvailabilityAvailableFieldsDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserAvailabilityAvailableFieldsDto)
  availableFields: UpdateUserAvailabilityAvailableFieldsDto
}

export class DeleteUserAvailabilityDto implements DeleteUserAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description:
      'Может ли пользователь удалять любых пользователей. Если стоит true, то может удалить любого. Если стоит false, то следует обращать внимание на другие параметры',
  })
  @IsBoolean()
  all: boolean

  @ApiProperty({
    description: 'Список ролей, пользователей с которыми может удалить пользователь',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(RoleModel, true)
  availableRoles: Types.ObjectId[]

  @ApiProperty({
    description: 'Список пользователей, которых может удалить пользователь. Имеет смысл только если в поле all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(UserModel, true)
  availableUsers: Types.ObjectId[]

  @ApiProperty({
    description: 'Список пользователей, которых пользователь не может удалить. Имеет смысл только если в поле all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(UserModel, true)
  forbiddenUsers: Types.ObjectId[]
}

export class UpdateUserPasswordAvailabilityDto implements UpdateUserPasswordAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description: 'Может ли пользователь обновить свой пароль',
  })
  @IsBoolean()
  self: boolean

  @ApiProperty({
    description:
      'Может ли пользователь обновлять пароли любых пользователей. Если стоит true, то может обновить пароль любого. Если стоит false, то следует обращать внимание на другие параметры',
  })
  @IsBoolean()
  all: boolean

  @ApiProperty({
    description: 'Список ролей, пароли пользователей с которыми может обновить пользователь',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(RoleModel, true)
  availableRoles: Types.ObjectId[]

  @ApiProperty({
    description: 'Список пользователей, пароли которых может обновить пользователь. Имеет смысл только если в поле all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(UserModel, true)
  availableUsers: Types.ObjectId[]

  @ApiProperty({
    description: 'Список пользователей, пароли которых пользователь не может обновить. Имеет смысл только если в поле all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(UserModel, true)
  forbiddenUsers: Types.ObjectId[]
}

export class UpdateUserAvailabilitiesAvailabilityDto implements UpdateUserAvailabilitiesAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description:
      'Может ли пользователь обновлять возможности любых пользователей. Если стоит true, то может обновить возможности любого. Если стоит false, то следует обращать внимание на другие параметры',
  })
  @IsBoolean()
  all: boolean

  @ApiProperty({
    description: 'Возможности, которые пользователь может обновлять у пользователя',
    type: CreateUserAvailableForInstallationAvailabilitiesDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserAvailableForInstallationAvailabilitiesDto)
  availableForInstallationAvailabilities: CreateUserAvailableForInstallationAvailabilitiesDto

  @ApiProperty({
    description: 'Список ролей, возможности пользователей с которыми может обновить пользователь',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(RoleModel, true)
  availableRoles: Types.ObjectId[]

  @ApiProperty({
    description: 'Список пользователей, возможности которых может обновить пользователь. Имеет смысл только если в поле all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(UserModel, true)
  availableUsers: Types.ObjectId[]

  @ApiProperty({
    description: 'Список пользователей, возможности которых пользователь не может обновить. Имеет смысл только если в поле all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(UserModel, true)
  forbiddenUsers: Types.ObjectId[]
}

export class CreateRoleAvailabilityDto implements CreateRoleAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean
}

export class UpdateRoleAvailabilityAvailableFieldsDto implements UpdateRoleAvailabilityAvailableFieldsModel {
  @ApiProperty({
    description: 'Может ли пользователь обновлять название роли',
  })
  @IsBoolean()
  label: boolean
}

export class UpdateRoleAvailabilityDto implements UpdateRoleAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description:
      'Может ли пользователь обновлять любые роли. Если стоит true, то может обновить любую роль. Если стоит false, то следует обращать внимание на другие параметры',
  })
  @IsBoolean()
  all: boolean

  @ApiProperty({
    description: 'Список ролей, которые пользователь может редактировать. Имеет смысл только если в all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(RoleModel, true)
  availableRoles: Types.ObjectId[]

  @ApiProperty({
    description: 'Поля, которые может обновлять пользователь',
    type: UpdateRoleAvailabilityAvailableFieldsDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateRoleAvailabilityAvailableFieldsDto)
  availableFields: UpdateRoleAvailabilityAvailableFieldsDto
}

export class DeleteRoleAvailabilityDto implements DeleteRoleAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean
}

export class AvailabilitiesDto implements Partial<AvailabilitiesModel> {
  @ApiProperty({
    description: 'Может ли пользователь редактировать расписание занятий',
    type: CreateScheduleAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateScheduleAvailabilityDto)
  createSchedule?: CreateScheduleAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь создавать группы',
    type: CreateGroupAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateGroupAvailabilityDto)
  createGroup?: CreateGroupAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь обновлять группы',
    type: UpdateGroupAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateGroupAvailabilityDto)
  updateGroup?: UpdateGroupAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь обновлять расписание звонков групп, принадлежащих факультетам',
    type: UpdateGroupCallScheduleForFacultiesAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateGroupCallScheduleForFacultiesAvailabilityDto)
  updateGroupCallScheduleForFaculties?: UpdateGroupCallScheduleForFacultiesAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь обновлять стадию обучения групп, принадлежащих факультетам',
    type: UpdateGroupLearningStageForFacultiesAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateGroupLearningStageForFacultiesAvailabilityDto)
  updateGroupLearningStageForFaculties?: UpdateGroupLearningStageForFacultiesAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь удалять группы',
    type: DeleteGroupAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => DeleteGroupAvailabilityDto)
  deleteGroup?: DeleteGroupAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь создавать факультеты',
    type: CreateFacultyAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateFacultyAvailabilityDto)
  createFaculty?: CreateFacultyAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь обновлять факультеты',
    type: UpdateFacultyAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateFacultyAvailabilityDto)
  updateFaculty?: UpdateFacultyAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь удалять факультеты',
    type: DeleteFacultyAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => DeleteFacultyAvailabilityDto)
  deleteFaculty?: DeleteFacultyAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь обращаться к эндпоинтам работы с версиями приложений',
    type: AppVersionAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => AppVersionAvailabilityDto)
  appVersion?: AppVersionAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь создавать других пользоватей',
    type: CreateUserAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserAvailabilityDto)
  createUser?: CreateUserAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь редактировать других пользователей',
    type: UpdateUserAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserAvailabilityDto)
  updateUser?: UpdateUserAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь удалять других пользователей',
    type: DeleteUserAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => DeleteUserAvailabilityDto)
  deleteUser?: DeleteUserAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь обновлять пароли других пользователей',
    type: UpdateUserPasswordAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserPasswordAvailabilityDto)
  updateUserPassword?: UpdateUserPasswordAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь обновлять возможности других пользователей',
    type: UpdateUserAvailabilitiesAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserAvailabilitiesAvailabilityDto)
  updateUserAvailabilities?: UpdateUserAvailabilitiesAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь создавать роли',
    type: CreateRoleAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateRoleAvailabilityDto)
  createRole?: CreateRoleAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь обновлять роли',
    type: UpdateRoleAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateRoleAvailabilityDto)
  updateRole?: UpdateRoleAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь удалять роли',
    type: DeleteRoleAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => DeleteRoleAvailabilityDto)
  deleteRole?: DeleteRoleAvailabilityDto
}

export class CreateUserDto {
  @ApiProperty({
    title: 'Имя пользователя',
    maxLength: 60,
    minLength: 1,
    example: 'Пользователь',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string

  @ApiProperty({
    title: 'Логин пользователь',
    maxLength: 60,
    minLength: 1,
    example: 'User',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  login: string

  @ApiProperty({
    title: 'Пароль пользователь',
    maxLength: 30,
    minLength: 1,
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  password: string

  @ApiProperty({
    title: 'Список разрешений пользователя',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilitiesDto)
  availabilities: AvailabilitiesDto

  @ApiProperty({
    title: 'Список доступных для авторизации интерфейсов',
    enum: ClientInterfacesEnum,
    isArray: true,
  })
  @IsEnum(ClientInterfacesEnum, { each: true })
  interfaces: ClientInterfacesEnum[]

  @ApiProperty({
    description: 'Список ролей, которые присвоены пользователю',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  roles: Types.ObjectId[]
}
