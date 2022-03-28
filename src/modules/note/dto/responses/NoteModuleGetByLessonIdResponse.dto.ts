import { ApiProperty } from '@nestjs/swagger'
import { NoteModuleResponseNote } from './NoteModuleCreateResponse.dto'

export class NoteModuleGetByLessonIdResponseDto {
  @ApiProperty({
    type: NoteModuleResponseNote,
    isArray: true,
  })
  notes: NoteModuleResponseNote[]
}
