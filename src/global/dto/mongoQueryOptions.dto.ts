import { QueryOptions } from 'mongoose'
import { IsOptional } from 'class-validator'
import { MongoModelProjection } from '../decorators/MongoModelProjection.decorator'

export class MongoQueryOptionsDto implements QueryOptions {
  @IsOptional()
  @MongoModelProjection()
  projection?: Record<string, number>
}
