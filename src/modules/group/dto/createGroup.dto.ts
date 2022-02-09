import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsMongoIdWithTransform()
  faculty: Types.ObjectId

  @IsOptional()
  @IsMongoIdWithTransform()
  callSchedule?: Types.ObjectId
}
