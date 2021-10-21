import { BadRequestException, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { Types } from 'mongoose'
import { INVALID_MONGO_ID, UNNECESSARY_SYMBOLS_IN_QUERY_PARAMETER } from '../constants/errors.constants'
import { isMongoId } from 'class-validator'

export interface ParseMongoIdPipeOptions {
  parameter: string
  required?: boolean
  multiple?: boolean
}

const defaultOptions: ParseMongoIdPipeOptions = {
  parameter: '',
  required: true,
  multiple: false,
}

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<any, Types.ObjectId | Types.ObjectId[] | undefined> {
  private readonly options = defaultOptions

  constructor(options?: ParseMongoIdPipeOptions) {
    this.options = { ...defaultOptions, ...options }
  }

  transform(value: string | undefined): Types.ObjectId | Types.ObjectId[] | undefined {
    if (!this.options.required && value === undefined) return value
    if (this.options.multiple && value) {
      const unnecessarySymbols = value.replace(/([a-zA-Z0-9,_])+/g, '')

      if (unnecessarySymbols) {
        throw new BadRequestException(UNNECESSARY_SYMBOLS_IN_QUERY_PARAMETER(this.options.parameter, unnecessarySymbols))
      }

      for (const id of value.split(',')) {
        if (!isMongoId(id)) {
          throw new HttpException(INVALID_MONGO_ID, HttpStatus.BAD_REQUEST)
        }
      }

      return value.split(',').map(Types.ObjectId.createFromHexString)
    }

    if (!isMongoId(value)) {
      throw new HttpException(INVALID_MONGO_ID, HttpStatus.BAD_REQUEST)
    }

    return Types.ObjectId.createFromHexString(value as string)
  }
}
