import { IsString } from 'class-validator'

export class CreateSecretLabelDto {
  @IsString()
  label: string
}
