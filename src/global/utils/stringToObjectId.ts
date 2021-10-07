import { MongoIdString } from '../types'
import { Types } from 'mongoose'

export const stringToObjectId = (id: MongoIdString | Types.ObjectId) => {
  if (typeof id === 'string') {
    id = Types.ObjectId(id)
  }

  return id
}
