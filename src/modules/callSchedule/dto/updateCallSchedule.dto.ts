import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CallScheduleItem } from './createCallSchedule.dto'
import { IsMongoIdWithTransform } from '../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { IsUndefinable } from '../../../global/decorators/isUndefinable.decorator'

export class UpdateCallScheduleDto {
  @IsMongoIdWithTransform()
  id: Types.ObjectId

  @IsUndefinable()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CallScheduleItem)
  schedule: CallScheduleItem[]

  @IsUndefinable()
  @IsString()
  @IsNotEmpty()
  name: string
}
