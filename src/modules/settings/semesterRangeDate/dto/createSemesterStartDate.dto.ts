import { Matches } from 'class-validator'
import { dateRegExp } from '../../../../global/regex'

export class CreateSemesterStartDateDto {
  @Matches(dateRegExp)
  startDate: Date

  @Matches(dateRegExp)
  endDate: Date
}
