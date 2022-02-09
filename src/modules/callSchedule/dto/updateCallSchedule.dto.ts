import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CallScheduleItem } from './createCallSchedule.dto'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'

export class UpdateCallScheduleDto {
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CallScheduleItem)
  schedule: CallScheduleItem[]

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string
}
