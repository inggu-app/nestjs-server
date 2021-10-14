import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { TypesEnum } from '../../global/enums/types.enum'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'

export enum FunctionalityRoutesEnum {
  GET_MANY = '/many',
}

export interface RegisterFunctionality {
  code: FunctionalityCodesEnum
  default: FunctionalityDefault<{ [key: string]: any }>
  title: string
}

export type FunctionalityDefault<T = string> = {
  [key in keyof T]: TypesEnum | FunctionalityAvailableTypeEnum
}

export enum FunctionalityFieldsEnum {
  code = 'code',
  title = 'title',
  default = 'default',
}

export type FunctionalityField = keyof typeof FunctionalityFieldsEnum

export interface AvailableFunctionality<T = { [key: string]: any }> {
  code: FunctionalityCodesEnum
  data: T
}

export interface FunctionalityGetManyDataForFunctionality {}
export const defaultFunctionalityGetManyData: FunctionalityDefault<FunctionalityGetManyDataForFunctionality> = {}
