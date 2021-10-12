import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateInterfaceDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  description: string
}
