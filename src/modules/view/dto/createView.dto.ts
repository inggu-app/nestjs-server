import { IsNotEmpty, IsString } from 'class-validator'

export class CreateViewDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  description: string
}
