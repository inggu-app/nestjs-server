import { MongoIdString } from '../types'
import { Types } from 'mongoose'
import { isMongoId } from 'class-validator'
import { BadRequestException } from '@nestjs/common'
import { INVALID_MONGO_ID } from '../constants/errors.constants'

export const stringToObjectId = (id: MongoIdString | Types.ObjectId) => {
  if (typeof id === 'string' && !isMongoId(id)) {
    throw new BadRequestException(INVALID_MONGO_ID)
  }

  return typeof id === 'string' ? Types.ObjectId(id) : id
}
