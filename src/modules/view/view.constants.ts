import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'

export enum ViewRoutesEnum {
  CREATE = '/',
  GET_BY_CODE = '/by-code',
  GET_BY_USER_ID = '/by-user-id',
  UPDATE = '/',
  DELETE = '/',
}

export enum ViewGetQueryParametersEnum {
  CODE = 'code',
  FIELDS = 'fields',
  USER_ID = 'userId',
}

export enum ViewFieldsEnum {
  code = 'code',
  description = 'description',
}

export const ViewAdditionalFieldsEnum = {
  ...DefaultFieldsEnum,
}

export type ViewField = keyof typeof ViewFieldsEnum
