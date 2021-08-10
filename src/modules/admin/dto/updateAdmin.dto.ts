import { IsMongoId, IsNotEmpty, IsString } from 'class-validator'
import { Types } from 'mongoose'
import { Credentials } from './createAdmin.dto'

export interface IUpdateAdminDto {
  credentials: Credentials
  id: Types.ObjectId
  name: string
  login: string
}

export class UpdateAdminDto {
  credentials: Credentials
  @IsMongoId()
  id: Types.ObjectId

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  login: string
}
