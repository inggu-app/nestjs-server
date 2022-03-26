import { ApiProperty } from '@nestjs/swagger'

export class CheckScheduleUpdateResponseDto {
  @ApiProperty({
    title: 'Обновилось ли расписание',
  })
  updated: boolean
}
