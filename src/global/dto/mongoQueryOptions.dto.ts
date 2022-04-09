import { QueryOptions } from 'mongoose'
import { MongoModelProjection } from '../decorators/MongoModelProjection.decorator'
import { IsUndefinable } from '../decorators/isUndefinable.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotIn, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

interface IPopulateOptions {
  projection?: Record<string, number>
}

interface IPopulate {
  path: string

  options?: IPopulateOptions
}

class PopulateOptions implements IPopulateOptions {
  @ApiProperty({
    name: 'projection?',
    description: `Позволяет брать определённые поля моделей. Существует ряд правил, которые нужно соблюдать:
       1. Cам объект projection или вложенные объекты не должны быть пустыми
       2. В обном объекте не может быть одновременно 1 и 0 или 0 и объект
       3. Нельзя использовать поле id`,
    example: {
      id: 0,
      name: 1,
    },
    required: false,
  })
  @IsUndefinable()
  @MongoModelProjection(false)
  projection?: Record<string, any>
}

class Populate implements IPopulate {
  @ApiProperty({
    description: 'Название поля, которое нужно заменить',
  })
  @IsString()
  @IsNotIn(['_id', 'id'])
  path: string

  @ApiProperty({
    description: 'Опции при замене. Обычно это только projection',
    type: PopulateOptions,
    required: false,
  })
  @IsUndefinable()
  @ValidateNested()
  @Type(() => PopulateOptions)
  options?: PopulateOptions
}

export class MongoQueryOptionsDto implements QueryOptions {
  @ApiProperty({
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

  @ApiProperty({
    name: 'populate?',
    description: 'Позволяет заменить id сущности в документе на документ по этому id из соответствующей коллекции',
    type: [Populate],
    required: false,
  })
  @IsUndefinable()
  @IsArray()
  @ValidateNested()
  @Type(() => Populate)
  populate?: Populate[]
}
