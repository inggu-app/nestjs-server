import { IsIn, IsInt, IsMongoId, IsNotEmpty, IsString, Min } from 'class-validator'
import { DeviceId } from '../../../global/types'
import { WeekDaysEnum } from '../../../global/enums/WeekDays'
import { Types } from 'mongoose'

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  content: string

  @IsString()
  @IsNotEmpty()
  deviceId: DeviceId

  @IsMongoId()
  group: Types.ObjectId

  @IsInt()
  @Min(1)
  week: number

  @IsIn([
    WeekDaysEnum.MONDAY,
    WeekDaysEnum.TUESDAY,
    WeekDaysEnum.WEDNESDAY,
    WeekDaysEnum.THURSDAY,
    WeekDaysEnum.FRIDAY,
    WeekDaysEnum.SATURDAY,
    WeekDaysEnum.SUNDAY,
  ])
  weekDay: WeekDaysEnum

  @IsInt()
  lessonNumber: number
}
