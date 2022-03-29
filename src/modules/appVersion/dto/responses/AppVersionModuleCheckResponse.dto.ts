import { ApiProperty } from '@nestjs/swagger'

export class AppVersionModuleCheckResponseDto {
  @ApiProperty({
    description: 'Есть ли обновление',
  })
  haveUpdate: boolean
}
