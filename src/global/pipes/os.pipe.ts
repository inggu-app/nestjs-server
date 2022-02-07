import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { INVALID_OS } from '../constants/errors.constants'
import { OperationSystem } from '../enums/OS.enum'
import { isEnum } from 'class-validator'

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

    if (!isEnum(value, OperationSystem)) {
      throw new HttpException(INVALID_OS, HttpStatus.BAD_REQUEST)
    }

    return value
  }
}
