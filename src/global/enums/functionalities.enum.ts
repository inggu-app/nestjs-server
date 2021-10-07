import enumKeyValuesMatch from '../utils/enumKeyValuesMatch'

export enum FunctionalityCodesEnum {
  ADMIN__CREATE = 'ADMIN__CREATE',
  ADMIN__GET = 'ADMIN__GET',
  ADMIN__RESET_PASSWORD = 'ADMIN__RESET_PASSWORD',

  GROUP__CREATE = 'GROUP__CREATE',
  GROUP__GET = 'GROUP__GET',
  GROUP__UPDATE = 'GROUP__UPDATE',
  GROUP__DELETE = 'GROUP__DELETE',
}

enumKeyValuesMatch(FunctionalityCodesEnum)
