import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { INCORRECT_STRING } from '../constants/errors.constants'

interface Options {
  required?: boolean
}

const defaultOptions: Options = {
  required: true,
}

@Injectable()
export class CustomParseStringPipe implements PipeTransform<any, string | undefined> {
  private readonly options = defaultOptions

  constructor(options?: Options) {
    this.options = { ...defaultOptions, ...options }
  }

  transform(value: any): string | undefined {
    if (!this.options.required && value === undefined) return value

    if (!value) {
      throw new HttpException(INCORRECT_STRING, HttpStatus.BAD_REQUEST)
    }

    return value
  }
}
