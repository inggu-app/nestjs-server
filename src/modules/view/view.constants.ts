export enum ViewRoutesEnum {
  CREATE = '/',
  GET_BY_CODE = '/by-code',
  UPDATE = '/',
  DELETE = '/',
}

export enum ViewGetQueryParametersEnum {
  CODE = 'code',
  FIELDS = 'fields',
}

export enum ViewFieldsEnum {
  code = 'code',
  description = 'description',
}

export type ViewField = keyof typeof ViewFieldsEnum
