import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { INVALID_OS } from '../constants/errors.constants'
import { getEnumValues } from '../utils/enumKeysValues'
import { OperationSystems } from '../enums/OS.enum'

interface Options {
  required?: boolean
}

const defaultOptions: Options = {
  required: true,
}

@Injectable()
export class OsPipe implements PipeTransform<any, Date> {
  private readonly options = defaultOptions

  constructor(options?: Options) {
    this.options = { ...defaultOptions, ...options }
  }

  transform(value: any): Date {
    if (!this.options.required && value === undefined) return value

    if (!getEnumValues(OperationSystems).includes(value)) {
      throw new HttpException(INVALID_OS, HttpStatus.BAD_REQUEST)
    }

    return value
  }
}
