import { ApiProperty } from '@nestjs/swagger'
import { NoteModuleResponseNote } from './NoteModuleCreateResponse.dto'

export class NoteModuleGetByIdResponseDto {
  @ApiProperty({
    type: NoteModuleResponseNote,
  })
  note: NoteModuleResponseNote
}
