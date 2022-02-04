import { IsString, MaxLength } from 'class-validator'

export class LoginDto {
  @IsString()
  @MaxLength(60)
  login: string

  @IsString()
  @MaxLength(30)
  password: string
}
