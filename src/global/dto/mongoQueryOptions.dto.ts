import { QueryOptions } from 'mongoose'
import { IsObject, IsOptional } from 'class-validator'

export class MongoQueryOptionsDto implements QueryOptions {
  @IsOptional()
  @IsObject()
  fields?: Record<string, number>

  @IsOptional()
  @IsObject()
  projection?: Record<string, number>
}
