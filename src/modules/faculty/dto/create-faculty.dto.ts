import { IsNotEmpty, IsString } from 'class-validator'

export class CreateFacultyDto {
  @IsString()
  @IsNotEmpty()
  title: string
}
