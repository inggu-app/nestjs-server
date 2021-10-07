import { EmptyEnum } from '../constants/other.constants'
import { TypesEnum } from '../enums/types.enum'

export const getEnumKeys = <T>(e: EmptyEnum<T>, valueType: TypesEnum = TypesEnum.NUMBER) => {
  return Object.keys(e).filter(k => typeof e[k as any] === valueType || 'number')
}

export const getEnumValues = (e: EmptyEnum, valueType: TypesEnum = TypesEnum.NUMBER): string[] => {
  return getEnumKeys(e, valueType).map(k => e[k as any])
}
