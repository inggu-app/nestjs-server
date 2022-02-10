import { IsNotEmpty, IsString } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'

export class UpdateFacultyDto {
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @IsUndefinable()
  @IsString()
  @IsNotEmpty()
  title?: string

  @IsMongoIdWithTransform(true)
  callSchedule?: Types.ObjectId | null
}
