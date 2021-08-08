import { IsNotEmpty, IsString } from 'class-validator'

export class LoginResponsibleDto {
  @IsString()
  @IsNotEmpty()
  login: string

  @IsString()
  @IsNotEmpty()
  password: string
}
