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
