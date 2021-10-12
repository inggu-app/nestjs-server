import { IsNotEmpty, IsString } from 'class-validator'

export class CreateInterfaceDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  description: string
}
