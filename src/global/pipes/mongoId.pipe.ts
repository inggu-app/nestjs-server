import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { Types } from 'mongoose'
import { INVALID_MONGO_ID } from '../../modules/group/group.constants'

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    const validObjectId: boolean = Types.ObjectId.isValid(value)

    if (!validObjectId) {
      throw new BadRequestException(INVALID_MONGO_ID)
    }

    return Types.ObjectId.createFromHexString(value)
  }
}
