import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'

export class UpdateFacultyDto {
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string

  @IsMongoIdWithTransform(true)
  callSchedule?: Types.ObjectId
}
