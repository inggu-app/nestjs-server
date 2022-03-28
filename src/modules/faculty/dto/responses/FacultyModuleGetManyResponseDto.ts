import { ApiProperty } from '@nestjs/swagger'
import { FacultyModuleResponseFaculty } from './FacultyModuleCreateResponseDto'

export class FacultyModuleGetManyResponseDto {
  @ApiProperty({
    type: FacultyModuleResponseFaculty,
    isArray: true,
  })
  faculties: FacultyModuleResponseFaculty[]

  @ApiProperty({
    title: 'Количество всех факультетов',
    description: 'Зависит от query-параметра title',
  })
  count: number
}
