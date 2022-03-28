import { ApiProperty } from '@nestjs/swagger'
import { FacultyModuleResponseFaculty } from './FacultyModuleCreateResponseDto'

export class FacultyModuleGetByIdsResponseDto {
  @ApiProperty({
    type: FacultyModuleResponseFaculty,
    isArray: true,
  })
  faculties: FacultyModuleResponseFaculty[]
}
