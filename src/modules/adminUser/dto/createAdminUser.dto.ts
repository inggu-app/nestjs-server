import { IsBoolean, IsObject, IsOptional, IsString, MaxLength } from 'class-validator'
import { Availability } from '../adminUser.model'
import { Type } from 'class-transformer'

export class AvailabilityDto implements Availability {
  @IsOptional()
  @IsBoolean()
  canUpdateCallSchedule: boolean

  @IsOptional()
  @IsBoolean()
  canCreateFaculty: boolean

  @IsOptional()
  @IsBoolean()
  canCreateGroup: boolean

  @IsOptional()
  @IsBoolean()
  canDeleteFaculty: boolean

  @IsOptional()
  @IsBoolean()
  canDeleteGroup: boolean

  @IsOptional()
  @IsBoolean()
  canUpdateFaculty: boolean

  @IsOptional()
  @IsBoolean()
  canUpdateGroup: boolean

  @IsOptional()
  @IsBoolean()
  canUpdateSemesterRange: boolean
}

export class CreateAdminUserDto {
  @IsString()
  @MaxLength(60)
  name: string

  @IsString()
  @MaxLength(60)
  login: string

  @IsString()
  @MaxLength(30)
  password: string

  @IsObject()
  @Type(() => AvailabilityDto)
  availability: AvailabilityDto
}
