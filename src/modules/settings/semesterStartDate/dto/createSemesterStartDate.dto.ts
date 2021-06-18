import { IsDateString } from 'class-validator'

export class CreateSemesterStartDateDto {
  @IsDateString()
  date: Date
}
