import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { QUERY_PARAMETER_ENUM_INCORRECT, QUERY_PARAMETER_IS_EMPTY, QUERY_PARAMETER_IS_REQUIRED } from '../constants/errors.constants'
import { isEnum } from 'class-validator'

interface Options {
  required?: boolean
}

const defaultOptions: Options = {
  required: true,
}

@Injectable()
export class ParseStringByEnumPipe implements PipeTransform {
  private readonly options = defaultOptions

  constructor(private readonly parameter: string, private readonly enumerator: any, options?: Options) {
    this.options = { ...defaultOptions, ...options }
  }

  transform(value: any): Enumerator | undefined {
    if (!this.options.required && value === undefined) return value

    if (this.options.required && value === undefined) throw new BadRequestException(QUERY_PARAMETER_IS_REQUIRED(this.parameter))
    if (this.options.required && value === '') throw new BadRequestException(QUERY_PARAMETER_IS_EMPTY(this.parameter))
    if (!isEnum(value, this.enumerator)) throw new BadRequestException(QUERY_PARAMETER_ENUM_INCORRECT(this.parameter))

    return value
  }
}
