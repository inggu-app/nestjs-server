import { QueryOptions } from 'mongoose'
import { MongoModelProjection } from '../decorators/MongoModelProjection.decorator'
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { IsUndefinable } from '../decorators/isUndefinable.decorator'

export class MongoQueryOptionsDto implements QueryOptions {
  @ApiModelProperty({
    name: 'projection?',
    description: `Позволяет брать определённые поля моделей. Существует ряд правил, которые нужно соблюдать:
       1. Cам объект projection или вложенные объекты не должны быть пустыми
       2. В обном объекте не может быть одновременно 1 и 0 или 0 и объект
       3. Во вложенных объектах нельзя использовать поле id`,
    example: {
      id: 0,
      name: 1,
    },
    required: false,
  })
  @IsUndefinable()
  @MongoModelProjection()
  projection?: Record<string, number>
}
