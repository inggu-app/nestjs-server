import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { matches } from 'class-validator'
import { INVALID_DATE } from '../constants/errors.constants'
import { dateRegExp } from '../regex'

interface Options {
  required?: boolean
}

const defaultOptions: Options = {
  required: true,
}

@Injectable()
export class ParseDatePipe implements PipeTransform<any, Date | undefined> {
  private readonly options = defaultOptions

  constructor(options?: Options) {
    this.options = { ...defaultOptions, ...options }
  }

  transform(value: any): Date | undefined {
    if (!this.options?.required && value === undefined) return value

    if (typeof value === 'string') value = value.replace(/"/g, '')
    if (!matches(value, dateRegExp) && value !== undefined) {
      throw new HttpException(INVALID_DATE, HttpStatus.BAD_REQUEST)
    }

    return new Date(value)
  }
}
