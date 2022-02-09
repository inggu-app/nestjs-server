import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'

export class CreateFacultyDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsOptional()
  @IsMongoIdWithTransform()
  callSchedule?: Types.ObjectId
}
