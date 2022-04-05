import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsObject, Matches, Max, Min, ValidateNested } from 'class-validator'
import { timeRegExp } from '../../../../global/regex'
import { CallScheduleItemModel } from '../../group.model'
import { IsMongoIdWithTransform } from '../../../../global/decorators/IsMongoIdWithTransform.decorator'
import { Types } from 'mongoose'
import { Type } from 'class-transformer'

export class CallScheduleItemDto implements CallScheduleItemModel {
  @ApiProperty({
    title: 'Номер занятия, для которого назначается расписание',
    maxLength: 10,
    minLength: 1,
    example: 3,
  })
  @IsNumber()
  @Max(10)
  @Min(1)
  lessonNumber: number

  @ApiProperty({
    title: 'Время, когда начинается занятие',
    description: `Время должно соответствовать регулярному выражению ${timeRegExp}`,
    example: '10:40',
  })
  @Matches(timeRegExp)
  start: string

  @ApiProperty({
    title: 'Время, когда заканчивается занятие',
    description: `Время должно соответствовать регулярному выражению ${timeRegExp}`,
    example: '12:00',
  })
  @Matches(timeRegExp)
  end: string
}

export class UpdateCallScheduleByFacultyDto {
  @IsMongoIdWithTransform()
  facultyId: Types.ObjectId

  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CallScheduleItemDto)
  callSchedule: CallScheduleItemDto[]
}
