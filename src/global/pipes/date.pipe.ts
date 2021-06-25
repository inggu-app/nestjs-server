import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { isISO8601 } from 'class-validator'
import { INVALID_DATE } from '../constants/errors.constants'

@Injectable()
export class ParseDatePipe implements PipeTransform<any, Date> {
  transform(value: any): Date {
    if (!isISO8601(value) && value !== undefined) {
      throw new BadRequestException(INVALID_DATE)
    }

    return new Date(value || 0)
  }
}
