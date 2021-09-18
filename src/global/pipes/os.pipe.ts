import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { INVALID_OS } from '../constants/errors.constants'
import { OSs } from '../constants/other.constants'

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

    if (!OSs.includes(value)) {
      throw new HttpException(INVALID_OS, HttpStatus.BAD_REQUEST)
    }

    return value
  }
}
