import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'
import { MongoIdString } from '../../../global/types'
import { Type } from 'class-transformer'
import { CallScheduleItem } from './createCallSchedule.dto'

export class UpdateCallScheduleDto {
  @IsMongoId()
  id: MongoIdString

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
