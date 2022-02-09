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

  @IsOptional()
  @IsMongoIdWithTransform()
  faculty?: Types.ObjectId

  @IsOptional()
  @IsMongoIdWithTransform()
  callSchedule?: Types.ObjectId
}
