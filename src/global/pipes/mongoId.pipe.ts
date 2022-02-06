import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { Types } from 'mongoose'
import {
  INVALID_MONGO_ID,
  QUERY_PARAMETER_HAVE_MULTIPLE_VALUES,
  QUERY_PARAMETER_IS_EMPTY,
  QUERY_PARAMETER_IS_REQUIRED,
} from '../constants/errors.constants'
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
    if (this.options.required && value === undefined) throw new BadRequestException(QUERY_PARAMETER_IS_REQUIRED(this.options.parameter))
    if (this.options.required && value === '') throw new BadRequestException(QUERY_PARAMETER_IS_EMPTY(this.options.parameter))

    const ids = (value as string).split(',')
    if (!this.options.multiple && ids.length > 1)
      throw new BadRequestException(QUERY_PARAMETER_HAVE_MULTIPLE_VALUES(this.options.parameter))
    for (const id of ids) {
      if (!isMongoId(id)) throw new BadRequestException(INVALID_MONGO_ID(id))
    }

    if (this.options.multiple) return ids.map(Types.ObjectId)
    else return Types.ObjectId(ids[0])
  }
}
