import { IsBoolean, IsEnum, IsNotEmpty, IsObject, IsString, MaxLength, ValidateNested } from 'class-validator'
import {
  AppVersionAvailabilityModel,
  AvailabilityModel,
  CreateCallScheduleAvailabilityModel,
  CreateFacultyAvailabilityModel,
  CreateGroupAvailabilityModel,
  CreateScheduleAvailabilityModel,
  CreateUserAvailabilityModel,
  CreateUserAvailableForInstallationAvailabilitiesModel,
  DeleteCallScheduleAvailabilityModel,
  DeleteFacultyAvailabilityModel,
  DeleteGroupAvailabilityModel,
  LearningStageAvailabilityModel,
  UpdateCallScheduleAvailabilityAvailableFieldsModel,
  UpdateCallScheduleAvailabilityModel,
  UpdateFacultyAvailabilityAvailableFieldsModel,
  UpdateFacultyAvailabilityModel,
  UpdateGroupAvailabilityAvailableFieldsModel,
  UpdateGroupAvailabilityModel,
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
import { CallScheduleModel } from '../../../callSchedule/callSchedule.model'
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

  @ApiProperty({
    description: 'Может ли пользователь редактировать расписания звонков факультета',
  })
  @IsBoolean()
  callSchedule: boolean
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

export class CreateCallScheduleAvailabilityDto implements CreateCallScheduleAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean
}

export class UpdateCallScheduleAvailabilityAvailableFieldsDto implements UpdateCallScheduleAvailabilityAvailableFieldsModel {
  @ApiProperty({
    description: 'Может ли пользователь обновить само расписание звонков',
  })
  @IsBoolean()
  schedule: boolean

  @ApiProperty({
    description: 'Может ли пользователь обновить название расписания звонков',
  })
  @IsBoolean()
  name: boolean

  @ApiProperty({
    description: 'Может ли пользователь устанавливать расписания как дефолтное',
  })
  @IsBoolean()
  isDefault: boolean
}

export class UpdateCallScheduleAvailabilityDto implements UpdateCallScheduleAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description:
      'Доступны ли пользователю для обновления все расписания звонков. Если стоит true, то доступны все. Если стоит false, то нужно опираться на список в поле availableCallSchedules',
  })
  @IsBoolean()
  all: boolean

  @ApiProperty({
    description: 'Список расписаний звонков, доступных для редактирования. Имеет смысл только если в all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(CallScheduleModel, true)
  availableCallSchedules: Types.ObjectId[]

  @ApiProperty({
    description: 'Доступные пользователю для редактирования поля',
    type: UpdateCallScheduleAvailabilityAvailableFieldsDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateCallScheduleAvailabilityAvailableFieldsDto)
  availableFields: UpdateCallScheduleAvailabilityAvailableFieldsDto
}

export class DeleteCallScheduleAvailabilityDto implements DeleteCallScheduleAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean

  @ApiProperty({
    description:
      'Доступны ли пользователю для удаления все расписания звонков. Если стоит true, то доступны все. Если стоит false, то нужно опираться на список в поле availableCallSchedules',
  })
  @IsBoolean()
  all: boolean

  @ApiProperty({
    description: 'Список расписаний звонков, доступных для удаления. Имеет смысл только если в all стоит false',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(CallScheduleModel, true)
  availableCallSchedules: Types.ObjectId[]
}

export class AppVersionAvailabilityDto implements AppVersionAvailabilityModel {
  @ApiProperty({
    description: 'Разрешено ли пользователю обращаться к этому эндпоинту',
  })
  @IsBoolean()
  available: boolean
}

export class LearningStageAvailabilityDto implements LearningStageAvailabilityModel {
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
  @IsEnum(ClientInterfacesEnum)
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
  })
  @IsMongoIdWithTransform({ each: true })
  @CheckExists(RoleModel, true)
  availableForInstallationRoles: Types.ObjectId[]
}

export class AvailabilityDto implements Partial<AvailabilityModel> {
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
    description: 'Может ли пользователь создавать расписания звонков',
    type: CreateCallScheduleAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateCallScheduleAvailabilityDto)
  createCallSchedule?: CreateCallScheduleAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь обновлять расписания звонков',
    type: UpdateCallScheduleAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateCallScheduleAvailabilityDto)
  updateCallSchedule?: UpdateCallScheduleAvailabilityDto

  @ApiProperty({
    description: 'Может ли пользователь удалять расписания звонков',
    type: DeleteCallScheduleAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => DeleteCallScheduleAvailabilityDto)
  deleteCallSchedule?: DeleteCallScheduleAvailabilityDto

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
    description: 'Может ли пользователь обращаться к эндпоинтам работы с стадиями обучения',
    type: LearningStageAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => LearningStageAvailabilityDto)
  learningStage?: LearningStageAvailabilityDto

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
  @Type(() => AvailabilityDto)
  availability: AvailabilityDto

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
