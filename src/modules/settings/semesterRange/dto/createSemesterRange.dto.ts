import { Matches } from 'class-validator'
import { dateRegExp } from '../../../../global/regex'

export class CreateSemesterRangeDto {
  @Matches(dateRegExp)
  startDate: Date

  @Matches(dateRegExp)
  endDate: Date
}
