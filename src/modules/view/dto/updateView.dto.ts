import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateViewDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  description: string
}
