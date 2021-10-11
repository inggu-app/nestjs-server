import { ParseMongoIdPipe, ParseMongoIdPipeOptions } from '../pipes/mongoId.pipe'
import { Query } from '@nestjs/common'

export const MongoId = (queryParameter: string, options?: ParseMongoIdPipeOptions) => {
  return Query(queryParameter, new ParseMongoIdPipe(options))
}
