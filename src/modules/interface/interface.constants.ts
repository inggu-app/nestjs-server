import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

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
export const defaultInterfaceCreateData: InterfaceCreateDataForFunctionality = {}

export interface InterfaceGetByCodeDataForFunctionality {}
export const defaultInterfaceGetByCodeData: InterfaceGetByCodeDataForFunctionality = {}

export interface InterfaceUpdateDataForFunctionality {}
export const defaultInterfaceUpdateData: InterfaceUpdateDataForFunctionality = {}

export interface InterfaceDeleteDataForFunctionality {}
export const defaultInterfaceDeleteData: InterfaceDeleteDataForFunctionality = {}
