import { IsString, Matches } from 'class-validator'

export class CreateAppVersionDto {
  @IsString()
  @Matches(/\d+.\d+.\d+/)
  iosVersion: string

  @IsString()
  @Matches(/\d+.\d+.\d+/)
  androidVersion: string
}
