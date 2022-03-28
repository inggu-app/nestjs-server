import { ApiProperty } from '@nestjs/swagger'
import { FacultyModuleResponseFaculty } from './FacultyModuleCreateResponseDto'

export class FacultyModuleGetByIdResponseDto {
  @ApiProperty({
    type: FacultyModuleResponseFaculty,
  })
  faculty: FacultyModuleResponseFaculty
}
