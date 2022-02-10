import { IsNotEmpty, IsString } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'

export class CreateFacultyDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsUndefinable()
  @IsMongoIdWithTransform(true)
  callSchedule?: Types.ObjectId | null
}
