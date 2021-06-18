import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { Types } from 'mongoose'
import { INVALID_MONGO_ID } from '../constants/errors.constants'

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(INVALID_MONGO_ID)
    }

    return Types.ObjectId.createFromHexString(value)
  }
}
