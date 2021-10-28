import { BadRequestException, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { isInt } from 'class-validator'
import { INCORRECT_INT } from '../constants/errors.constants'

interface Options {
  required?: boolean
  intType: 'positive' | 'negative' | 'all'
}

const defaultOptions: Options = {
  required: true,
  intType: 'all',
}

@Injectable()
export class CustomParseIntPipe implements PipeTransform<any, number | undefined> {
  private readonly options = defaultOptions

  constructor(options?: Options) {
    this.options = { ...defaultOptions, ...options }
  }

  transform(value: any): number | undefined {
    if (!this.options.required && value === undefined) return value

    if (!isInt(parseInt(value))) {
      throw new HttpException(INCORRECT_INT, HttpStatus.BAD_REQUEST)
    }

    const number = parseInt(value)
    switch (this.options.intType) {
      case 'positive':
        if (number <= 0) throw new BadRequestException(INCORRECT_INT)
        break
      case 'negative':
        if (number >= 0) throw new BadRequestException(INCORRECT_INT)
        break
    }

    return parseInt(value)
  }
}
