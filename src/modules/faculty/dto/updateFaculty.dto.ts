import { IsMongoId, IsNotEmpty, IsString } from 'class-validator'

export class UpdateFacultyDto {
  @IsMongoId()
  id: string

  @IsString()
  @IsNotEmpty()
  title: string
}
