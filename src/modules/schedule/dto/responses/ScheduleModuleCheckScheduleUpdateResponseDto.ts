import { ApiProperty } from '@nestjs/swagger'

export class ScheduleModuleCheckScheduleUpdateResponseDto {
  @ApiProperty({
    title: 'Обновилось ли расписание',
  })
  updated: boolean
}
