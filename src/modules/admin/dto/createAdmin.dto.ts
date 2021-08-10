import { IsNotEmpty, IsString } from 'class-validator'

export interface ICreateAdminDto {
  credentials: Credentials
  name: string
  login: string
}

export class CreateAdminDto implements ICreateAdminDto {
  credentials: Credentials

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  login: string
}

export class Credentials {
  @IsString()
  @IsNotEmpty()
  login: string

  @IsString()
  @IsNotEmpty()
  password: string
}
