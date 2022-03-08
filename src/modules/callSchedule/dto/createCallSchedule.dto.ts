import { IsArray, IsNotEmpty, IsNumber, IsString, Matches, Max, MaxLength, Min, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CallScheduleItemModel } from '../callSchedule.model'
import { timeRegExp } from '../../../global/regex'
import { ApiProperty } from '@nestjs/swagger'

export class CallScheduleItem implements CallScheduleItemModel {
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

export class CreateCallScheduleDto {
  @ApiProperty({
    title: 'Список элементов расписания звонков',
    type: [CallScheduleItem],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CallScheduleItem)
  schedule: CallScheduleItem[]

  @ApiProperty({
    title: 'Уникальное название расписания звонков',
    example: 'Расписание звонков',
    maxLength: 60,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string
}
