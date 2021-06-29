import { Matches } from 'class-validator'
import { dateRegExp } from '../../../../global/regex'

export class CreateSemesterStartDateDto {
  @Matches(dateRegExp)
  date: Date
}
