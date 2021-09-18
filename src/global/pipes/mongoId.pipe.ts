import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { Types } from 'mongoose'
import { INVALID_MONGO_ID } from '../constants/errors.constants'

interface Options {
  required?: boolean
}

const defaultOptions: Options = {
  required: true,
}

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<any, Types.ObjectId | undefined> {
  private readonly options = defaultOptions

  constructor(options?: Options) {
    this.options = { ...defaultOptions, ...options }
  }

  transform(value: any): Types.ObjectId | undefined {
    if (!this.options.required && value === undefined) return value

    if (!Types.ObjectId.isValid(value)) {
      throw new HttpException(INVALID_MONGO_ID, HttpStatus.BAD_REQUEST)
    }

    return Types.ObjectId.createFromHexString(value)
  }
}
