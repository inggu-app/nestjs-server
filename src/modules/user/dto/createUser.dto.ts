import { IsBoolean, IsEnum, IsNotEmpty, IsObject, IsString, MaxLength, ValidateNested } from 'class-validator'
import { Availability } from '../user.model'
import { Type } from 'class-transformer'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { ClientInterfacesEnum } from '../../../global/enums/ClientInterfaces.enum'

export class AvailabilityDto implements Partial<Availability> {
  @ApiProperty({
    required: false,
    title: 'Может ли пользователь обновить любое расписание звонков.',
  })
  @IsUndefinable()
  @IsBoolean()
  canUpdateCallSchedule?: boolean

  @ApiProperty({
    required: false,
    title: 'Может ли пользователь создать факультет.',
  })
  @IsUndefinable()
  @IsBoolean()
  canCreateFaculty?: boolean

  @ApiProperty({
    required: false,
    title: 'Может ли пользователь создать группу.',
  })
  @IsUndefinable()
  @IsBoolean()
  canCreateGroup?: boolean

  @ApiProperty({
    required: false,
    title: 'Может ли пользователь удалить факультет.',
  })
  @IsUndefinable()
  @IsBoolean()
  canDeleteFaculty?: boolean

  @ApiProperty({
    required: false,
    title: 'Может ли пользователь удалить группу.',
  })
  @IsUndefinable()
  @IsBoolean()
  canDeleteGroup?: boolean

  @ApiProperty({
    required: false,
    title: 'Может ли пользователь обновить факультет.',
  })
  @IsUndefinable()
  @IsBoolean()
  canUpdateFaculty?: boolean

  @ApiProperty({
    required: false,
    title: 'Может ли пользователь обновить группу.',
  })
  @IsUndefinable()
  @IsBoolean()
  canUpdateGroup?: boolean

  // TODO: посмотреть
  @ApiProperty({
    required: false,
    title: 'Может ли пользователь обновить ',
  })
  @IsUndefinable()
  @IsBoolean()
  canUpdateSemesterRange?: boolean

  @ApiProperty({
    required: false,
    title: 'Может ли пользователь создать расписание занятий',
  })
  @IsUndefinable()
  @IsBoolean()
  canCreateSchedule?: boolean
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
  })
  @IsEnum(ClientInterfacesEnum, { each: true })
  interfaces: ClientInterfacesEnum[]
}
