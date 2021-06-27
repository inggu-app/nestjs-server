import { IsString, Matches } from 'class-validator'

export class CreateAppVersionDto {
  @IsString()
  @Matches(/\d+.\d+.\d+/g)
  iosVersion: string

  @IsString()
  @Matches(/\d+.\d+.\d+/g)
  androidVersion: string
}
