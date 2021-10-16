import { IsNotEmpty, IsString } from 'class-validator'
import { MongoIdString } from '../../../global/types'

export class CreateViewDto {
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
