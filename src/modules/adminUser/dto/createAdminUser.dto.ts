import { IsBoolean, IsNotEmpty, IsObject, IsString, MaxLength, ValidateNested } from 'class-validator'
import { Availability } from '../adminUser.model'
import { Type } from 'class-transformer'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'
import { ApiProperty } from '@nestjs/swagger'

export class AvailabilityDto implements Partial<Availability> {
  @ApiProperty({
    required: false,
    title: 'Может ли администратор обновить любое расписание звонков.',
  })
  @IsUndefinable()
  @IsBoolean()
  canUpdateCallSchedule?: boolean

  @ApiProperty({
    required: false,
    title: 'Может ли администратор создать факультет.',
  })
  @IsUndefinable()
  @IsBoolean()
  canCreateFaculty?: boolean

  @ApiProperty({
    required: false,
    title: 'Может ли администратор создать группу.',
  })
  @IsUndefinable()
  @IsBoolean()
  canCreateGroup?: boolean

  @ApiProperty({
    required: false,
    title: 'Может ли администратор удалить факультет.',
  })
  @IsUndefinable()
  @IsBoolean()
  canDeleteFaculty?: boolean

  @ApiProperty({
    required: false,
    title: 'Может ли администратор удалить группу.',
  })
  @IsUndefinable()
  @IsBoolean()
  canDeleteGroup?: boolean

  @ApiProperty({
    required: false,
    title: 'Может ли администратор обновить факультет.',
  })
  @IsUndefinable()
  @IsBoolean()
  canUpdateFaculty?: boolean

  @ApiProperty({
    required: false,
    title: 'Может ли администратор обновить группу.',
  })
  @IsUndefinable()
  @IsBoolean()
  canUpdateGroup?: boolean

  // TODO: посмотреть
  @ApiProperty({
    required: false,
    title: 'Может ли администратор обновить ',
  })
  @IsUndefinable()
  @IsBoolean()
  canUpdateSemesterRange?: boolean
}

export class CreateAdminUserDto {
  @ApiProperty({
    title: 'Имя администратора',
    maxLength: 60,
    minLength: 1,
    example: 'Администратор',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string

  @ApiProperty({
    title: 'Логин администратора',
    maxLength: 60,
    minLength: 1,
    example: 'Admin',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  login: string

  @ApiProperty({
    title: 'Пароль администратора',
    maxLength: 30,
    minLength: 1,
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  password: string

  @ApiProperty({
    title: 'Список разрешений администратора',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => AvailabilityDto)
  availability: AvailabilityDto
}
