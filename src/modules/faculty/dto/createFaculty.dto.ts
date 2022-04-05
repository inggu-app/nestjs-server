import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { FacultyModel } from '../faculty.model'

export class CreateFacultyDto implements Partial<FacultyModel> {
  @ApiProperty({
    title: 'Название факультета',
    example: 'Экономический факультет',
    maxLength: 60,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  title: string
}
