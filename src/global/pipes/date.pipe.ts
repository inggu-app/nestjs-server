import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { matches } from 'class-validator'
import { INVALID_DATE } from '../constants/errors.constants'
import { dateRegExp } from '../regex'

@Injectable()
export class ParseDatePipe implements PipeTransform<any, Date> {
  transform(value: any): Date {
    if (typeof value === 'string') value = value.replace(/"/g, '')
    if (!matches(value, dateRegExp) && value !== undefined) {
      throw new BadRequestException(INVALID_DATE)
    }

    return new Date(value || 0)
  }
}
