import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { INVALID_APP_VERSION } from '../constants/errors.constants'
import { matches } from 'class-validator'

interface Options {
  required?: boolean
}

const defaultOptions: Options = {
  required: true,
}

@Injectable()
export class AppVersionPipe implements PipeTransform<any, Date | undefined> {
  private readonly options = defaultOptions

  constructor(options?: Options) {
    this.options = { ...defaultOptions, ...options }
  }

  transform(value: any): Date | undefined {
    if (!this.options.required && value === undefined) return value

    if (!matches(value, /\d+.\d+.\d+/)) {
      throw new HttpException(INVALID_APP_VERSION, HttpStatus.BAD_REQUEST)
    }

    return value
  }
}
