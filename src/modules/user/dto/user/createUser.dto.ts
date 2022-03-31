import { IsBoolean, IsEnum, IsNotEmpty, IsObject, IsString, MaxLength, ValidateNested } from 'class-validator'
import {
  AvailabilityModel,
  CreateGroupAvailabilityModel,
  CreateScheduleAvailabilityModel,
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
}
