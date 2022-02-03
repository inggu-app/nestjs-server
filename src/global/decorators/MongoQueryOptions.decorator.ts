import { Query } from '@nestjs/common'
import { ObjectValidationPipe } from '../pipes/objectValidation.pipe'
import { MongoQueryOptionsDto } from '../dto/mongoQueryOptions.dto'

export const MongoQueryOptions = () => {
  return Query('queryOptions', new ObjectValidationPipe({ dto: MongoQueryOptionsDto, parameterName: 'queryOptions', required: false }))
}
