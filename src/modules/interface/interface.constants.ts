import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { FunctionalityDefault } from '../functionality/functionality.constants'

export enum InterfaceRoutesEnum {
  CREATE = '/',
  GET_BY_CODE = '/by-code',
  UPDATE = '/',
  DELETE = '/',
}

export enum InterfaceGetQueryParametersEnum {
  CODE = 'code',
  FIELDS = 'fields',
}

export enum InterfaceFieldsEnum {
  code = 'code',
  description = 'description',
}
enumKeyValuesMatch(InterfaceFieldsEnum)

export type InterfaceField = keyof typeof InterfaceFieldsEnum

export interface InterfaceCreateDataForFunctionality {}
export const defaultInterfaceCreateData: FunctionalityDefault<InterfaceCreateDataForFunctionality> = {}

export interface InterfaceGetByCodeDataForFunctionality {}
export const defaultInterfaceGetByCodeData: FunctionalityDefault<InterfaceGetByCodeDataForFunctionality> = {}

export interface InterfaceUpdateDataForFunctionality {}
export const defaultInterfaceUpdateData: FunctionalityDefault<InterfaceUpdateDataForFunctionality> = {}

export interface InterfaceDeleteDataForFunctionality {}
export const defaultInterfaceDeleteData: FunctionalityDefault<InterfaceDeleteDataForFunctionality> = {}
