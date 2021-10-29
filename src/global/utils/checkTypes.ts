import { TypesEnum } from '../enums/types.enum'
import { isBoolean, isMongoId, isNumber, isString } from 'class-validator'
import { BadRequestException } from '@nestjs/common'

export const checkTypes = (checkedValue: any, referenceValue: TypesEnum) => {
  switch (referenceValue) {
    case TypesEnum.STRING:
      return typeof checkedValue === 'string'
    case TypesEnum.NUMBER:
      return typeof checkedValue === 'number'
    case TypesEnum.BOOLEAN:
      return typeof checkedValue === 'boolean'
    case TypesEnum.MONGO_ID:
      return isMongoId(checkedValue)
    case TypesEnum.STRING_ARRAY:
      return checkArray(checkedValue, isString)
    case TypesEnum.NUMBER_ARRAY:
      return checkArray(checkedValue, isNumber)
    case TypesEnum.BOOLEAN_ARRAY:
      return checkArray(checkedValue, isBoolean)
    case TypesEnum.MONGO_ID_ARRAY:
      return checkArray(checkedValue, isMongoId)
  }
}

const checkArray = (checkedValue: any[], func: (value: any) => boolean) => {
  let result = Array.isArray(checkedValue)
  if (Array.isArray(checkedValue)) {
    let valueType: any
    checkedValue.forEach((value, index) => {
      if (index != 0) {
        if (typeof valueType !== typeof value) {
          throw new BadRequestException('В массиве находятся элементы разных типов')
        }
      }
      valueType = typeof value
    })
    if (valueType) result = func(checkedValue[0])
  }
  return result
}
