import { IsBoolean, IsEnum, IsNotEmpty, IsObject, IsString, MaxLength, ValidateNested } from 'class-validator'
import { AvailabilityModel, CreateScheduleAvailabilityModel } from '../../models/user.model'
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
import { GroupService } from '../../../group/group.service'

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
  @CheckExists(GroupService, true)
  forbiddenGroups: Types.ObjectId[]
}

export class AvailabilityDto implements AvailabilityModel {
  @ApiProperty({
    description: 'Может ли пользователь редактировать расписание занятий',
    type: CreateScheduleAvailabilityDto,
    required: false,
  })
  @IsUndefinable()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateScheduleAvailabilityDto)
  createSchedule: CreateScheduleAvailabilityDto
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
