import { QueryOptions } from 'mongoose'
import { MongoModelProjection } from '../decorators/MongoModelProjection.decorator'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { IsUndefinable } from '../decorators/isUndefinable.decorator'

export class MongoQueryOptionsDto implements QueryOptions {
  @ApiModelProperty({
    name: 'projection?',
    example: {
      id: 0,
      name: 1,
    },
  })
  @IsUndefinable()
  @MongoModelProjection()
  projection?: Record<string, number>
}
