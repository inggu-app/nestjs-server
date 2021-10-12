import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'

export enum FunctionalityRoutesEnum {
  GET_MANY = '/many',
}

export interface RegisterFunctionality {
  code: FunctionalityCodesEnum
  default: { [key: string]: any }
  title: string
}

export interface AvailableFunctionality<T = { [key: string]: any }> {
  code: FunctionalityCodesEnum
  data: T
}

export interface FunctionalityGetManyDataForFunctionality {}
export const defaultFunctionalityGetManyData: FunctionalityGetManyDataForFunctionality = {}
