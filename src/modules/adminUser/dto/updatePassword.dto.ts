import { IsString, Max } from 'class-validator'

export class UpdatePasswordDto {
  @IsString()
  @Max(30)
  password: string
}
