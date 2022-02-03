import { IsBoolean, IsOptional, IsString, Max } from 'class-validator'
import { Availability } from '../adminUser.model'

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
  @Max(60)
  name: string

  @IsString()
  @Max(60)
  login: string

  @IsString()
  @Max(30)
  password: string

  // @Type(() => AvailabilityDto)
  // availability: AvailabilityDto
}
