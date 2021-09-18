import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { isInt } from 'class-validator'
import { INCORRECT_INT } from '../constants/errors.constants'

interface Options {
  required?: boolean
}

const defaultOptions: Options = {
  required: true,
}

@Injectable()
export class CustomParseIntPipe implements PipeTransform<any, number | undefined> {
  private readonly options = defaultOptions

  constructor(options?: Options) {
    this.options = { ...defaultOptions, ...options }
  }

  transform(value: any): number | undefined {
    if (!this.options.required && value === undefined) return value

    if (!isInt(Number(value))) {
      throw new HttpException(INCORRECT_INT, HttpStatus.BAD_REQUEST)
    }

    return Number(value)
  }
}
