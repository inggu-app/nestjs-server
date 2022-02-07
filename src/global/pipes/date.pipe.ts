import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { matches } from 'class-validator'
import { QUERY_PARAMETER_DATE_INCORRECT, QUERY_PARAMETER_IS_EMPTY, QUERY_PARAMETER_IS_REQUIRED } from '../constants/errors.constants'
import { dateTimeRegExp } from '../regex'

interface Options {
  required?: boolean
}

const defaultOptions: Options = {
  required: true,
}

@Injectable()
export class ParseDatePipe implements PipeTransform<any, Date | undefined> {
  private readonly options = defaultOptions

  constructor(private readonly parameter: string, options?: Options) {
    this.options = { ...defaultOptions, ...options }
  }

  transform(value: any): Date | undefined {
    if (!this.options.required && value === undefined) return value

    if (this.options.required && value === undefined) throw new BadRequestException(QUERY_PARAMETER_IS_REQUIRED(this.parameter))
    if (this.options.required && value === '') throw new BadRequestException(QUERY_PARAMETER_IS_EMPTY(this.parameter))
    if (!matches(value, dateTimeRegExp)) throw new BadRequestException(QUERY_PARAMETER_DATE_INCORRECT(this.parameter, dateTimeRegExp))

    return new Date(value)
  }
}
