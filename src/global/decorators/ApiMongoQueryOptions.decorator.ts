import { applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiQuery, getSchemaPath } from '@nestjs/swagger'
import { MongoQueryOptionsDto } from '../dto/mongoQueryOptions.dto'

export const ApiMongoQueryOptions = () => {
  return applyDecorators(
    ApiExtraModels(MongoQueryOptionsDto),
    ApiQuery({
      name: 'queryOptions',
      description: 'опции запроса',
      style: 'deepObject',
      explode: false,
      required: false,
      schema: { $ref: getSchemaPath(MongoQueryOptionsDto) },
    })
  )
}
