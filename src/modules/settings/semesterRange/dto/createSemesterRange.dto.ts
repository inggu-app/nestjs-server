import { Matches } from 'class-validator'
import { dateTimeRegExp } from '../../../../global/regex'

export class CreateSemesterRangeDto {
  @Matches(dateTimeRegExp)
  startDate: Date

  @Matches(dateTimeRegExp)
  endDate: Date
}
