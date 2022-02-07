import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { QUERY_PARAMETER_IS_EMPTY, QUERY_PARAMETER_IS_REQUIRED, QUERY_PARAMETER_REGEXP_INCORRECT } from '../constants/errors.constants'

interface Options {
  required?: boolean
  regExp?: RegExp
}

const defaultOptions: Options = {
  required: true,
  regExp: undefined,
}

@Injectable()
export class CustomParseStringPipe implements PipeTransform<any, string | undefined> {
  private readonly options = defaultOptions

  constructor(private readonly parameter: string, options?: Options) {
    this.options = { ...defaultOptions, ...options }
  }

  transform(value: any): string | undefined {
    if (!this.options.required && value === undefined) return value

    if (this.options.required && value === undefined) throw new BadRequestException(QUERY_PARAMETER_IS_REQUIRED(this.parameter))
    if (this.options.required && value === '') throw new BadRequestException(QUERY_PARAMETER_IS_EMPTY(this.parameter))
    if (this.options.regExp && !this.options.regExp.test(value))
      throw new BadRequestException(QUERY_PARAMETER_REGEXP_INCORRECT(this.parameter, this.options.regExp))

    return value
  }
}
