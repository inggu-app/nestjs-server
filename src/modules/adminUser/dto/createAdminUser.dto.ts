import { IsBoolean, IsObject, IsString, MaxLength, ValidateNested } from 'class-validator'
import { Availability } from '../adminUser.model'
import { Type } from 'class-transformer'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'

export class AvailabilityDto implements Partial<Availability> {
  @IsUndefinable()
  @IsBoolean()
  canUpdateCallSchedule?: boolean

  @IsUndefinable()
  @IsBoolean()
  canCreateFaculty?: boolean

  @IsUndefinable()
  @IsBoolean()
  canCreateGroup?: boolean

  @IsUndefinable()
  @IsBoolean()
  canDeleteFaculty?: boolean

  @IsUndefinable()
  @IsBoolean()
  canDeleteGroup?: boolean

  @IsUndefinable()
  @IsBoolean()
  canUpdateFaculty?: boolean

  @IsUndefinable()
  @IsBoolean()
  canUpdateGroup?: boolean

  @IsUndefinable()
  @IsBoolean()
  canUpdateSemesterRange?: boolean
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
  @ValidateNested()
  @Type(() => AvailabilityDto)
  availability: AvailabilityDto
}
