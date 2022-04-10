import { BadRequestException, PipeTransform, Query } from '@nestjs/common'
import { ObjectValidationPipe } from '../pipes/objectValidation.pipe'
import { MongoQueryOptionsDto } from '../dto/mongoQueryOptions.dto'

export const MongoQueryOptions = <T>(availableToPopulateFields: (keyof T)[] = []) => {
  return Query(
    'queryOptions',
    new ObjectValidationPipe({
      dto: MongoQueryOptionsDto,
      parameterName: 'queryOptions',
      required: false,
      replaceableKeys: { 'projection.id': 'projection._id' },
    }),
    new AvailableToPopulateFields(availableToPopulateFields as string[])
  )
}

class AvailableToPopulateFields implements PipeTransform {
  private readonly availableFields: string[] = []
  constructor(availableFields: string[]) {
    this.availableFields = availableFields
  }

  transform(value: MongoQueryOptionsDto): any {
    if (value?.populate) {
      value.populate.map(field => {
        if (!this.availableFields.includes(field.path)) throw new BadRequestException(`Для поля ${field.path} нельзя делать замену`)
      })
    }

    return value
  }
}
