import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'

export interface RegisterFunctionality {
  code: FunctionalityCodesEnum
  title: string
}

export interface AvailableFunctionality<T = { [key: string]: any }> {
  code: FunctionalityCodesEnum

  data: T
}
