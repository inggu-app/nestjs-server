import { TypesEnum } from '../enums/types.enum'
import { isMongoId } from 'class-validator'
import { BadRequestException } from '@nestjs/common'

export const checkTypes = (checkedValue: any, referenceValue: TypesEnum) => {
  switch (typeof checkedValue) {
    case 'string':
      if (isMongoId(checkedValue)) return referenceValue === TypesEnum.MONGO_ID
      return referenceValue === TypesEnum.STRING
    case 'number':
      return referenceValue === TypesEnum.NUMBER
    case 'boolean':
      return referenceValue === TypesEnum.BOOLEAN
    case 'object':
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
        if (!valueType) return true
        switch (typeof valueType) {
          case 'string':
            if (isMongoId(checkedValue[0])) return referenceValue === TypesEnum.MONGO_ID_ARRAY
            return referenceValue === TypesEnum.STRING_ARRAY
          case 'number':
            return referenceValue === TypesEnum.NUMBER_ARRAY
          case 'boolean':
            return referenceValue === TypesEnum.BOOLEAN_ARRAY
          case 'object':
            return referenceValue === TypesEnum.OBJECT_ARRAY
        }
      } else return referenceValue === TypesEnum.OBJECT
  }
}
