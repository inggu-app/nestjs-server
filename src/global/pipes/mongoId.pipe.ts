import { HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { Types } from 'mongoose'
import { INVALID_MONGO_ID } from '../constants/errors.constants'

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<any, Types.ObjectId | undefined> {
  transform(value: any): Types.ObjectId | undefined {
    if (value === undefined) return value

    if (!Types.ObjectId.isValid(value)) {
      throw new HttpException(INVALID_MONGO_ID, HttpStatus.BAD_REQUEST)
    }

    return Types.ObjectId.createFromHexString(value)
  }
}
