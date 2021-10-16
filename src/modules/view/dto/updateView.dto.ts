import { IsNotEmpty, IsString } from 'class-validator'
import { MongoIdString } from '../../../global/types'

export class UpdateViewDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsNotEmpty()
  interface: MongoIdString
}
