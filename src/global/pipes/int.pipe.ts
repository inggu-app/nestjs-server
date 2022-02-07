import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { isInt } from 'class-validator'
import {
  QUERY_PARAMETER_INT_INCORRECT,
  QUERY_PARAMETER_IS_EMPTY,
  QUERY_PARAMETER_IS_REQUIRED,
  QUERY_PARAMETER_NEGATIVE_INT_INCORRECT,
  QUERY_PARAMETER_POSITIVE_INT_INCORRECT,
} from '../constants/errors.constants'

interface Options {
  required?: boolean
  intType?: 'positive' | 'negative' | 'all'
}

const defaultOptions: Options = {
  required: true,
  intType: 'all',
}

@Injectable()
export class CustomParseIntPipe implements PipeTransform<any, number | undefined> {
  private readonly options = defaultOptions

  constructor(private readonly parameter: string, options?: Options) {
    this.options = { ...defaultOptions, ...options }
  }

  transform(value: any): number | undefined {
    if (!this.options.required && value === undefined) return value

    if (this.options.required && value === undefined) throw new BadRequestException(QUERY_PARAMETER_IS_REQUIRED(this.parameter))
    if (this.options.required && value === '') throw new BadRequestException(QUERY_PARAMETER_IS_EMPTY(this.parameter))
    if (!isInt(parseInt(value))) throw new BadRequestException(QUERY_PARAMETER_INT_INCORRECT(this.parameter))
    if (this.options.intType === 'positive' && parseInt(value) <= 0)
      throw new BadRequestException(QUERY_PARAMETER_POSITIVE_INT_INCORRECT(this.parameter))
    if (this.options.intType === 'negative' && parseInt(value) >= 0)
      throw new BadRequestException(QUERY_PARAMETER_NEGATIVE_INT_INCORRECT(this.parameter))

    return parseInt(value)
  }
}
