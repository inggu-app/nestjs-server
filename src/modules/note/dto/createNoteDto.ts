import { IsInt, IsMongoId, IsNotEmpty, IsString, Min } from 'class-validator'
import { DeviceId } from '../../../global/types'

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  content: string

  @IsString()
  @IsNotEmpty()
  deviceId: DeviceId

  @IsInt()
  @Min(1)
  week: number

  @IsMongoId()
  lesson: string
}
