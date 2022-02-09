import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'

export class UpdateGroupDto {
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string

  @IsMongoIdWithTransform(true)
  faculty?: Types.ObjectId

  @IsMongoIdWithTransform(true)
  callSchedule?: Types.ObjectId
}
