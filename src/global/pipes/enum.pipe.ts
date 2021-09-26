import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { VALUE_IS_NOT_INCLUDES_IN_ENUM } from '../constants/errors.constants'
import { EmptyEnum } from '../constants/other.constants'
import { getEnumValues } from '../utils/enumKeysValues'

interface Options<T> {
  enum: T
  required?: boolean
}

const defaultOptions: Options<any> = {
  enum: null,
  required: true,
}

@Injectable()
export class ParseEnumPipe<T extends EmptyEnum> implements PipeTransform<any, T> {
  private readonly options: Options<T> = defaultOptions

  constructor(options?: Options<T>) {
    this.options = { ...defaultOptions, ...options }
  }

  transform(value: any): T {
    if (!this.options?.required && value === undefined) return value

    if (
      !getEnumValues(this.options.enum)
        .map(i => JSON.stringify(i))
        .includes(value)
    ) {
      throw new HttpException(
        VALUE_IS_NOT_INCLUDES_IN_ENUM(this.options.enum),
        HttpStatus.BAD_REQUEST
      )
    }

    return value
  }
}
