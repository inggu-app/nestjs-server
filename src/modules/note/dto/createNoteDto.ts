import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator'
import { DeviceId } from '../../../global/types'
import { Types } from 'mongoose'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'

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

  @IsMongoIdWithTransform()
  lesson: Types.ObjectId
}
