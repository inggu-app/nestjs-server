import enumKeyValuesMatch from '../utils/enumKeyValuesMatch'

export enum FunctionalityCodesEnum {
  ADMIN__CREATE = 'ADMIN__CREATE',
  ADMIN__GET = 'ADMIN__GET',
  ADMIN__RESET_PASSWORD = 'ADMIN__RESET_PASSWORD',

  GROUP__CREATE = 'GROUP__CREATE',
  GROUP__GET_BY_GROUP_ID = 'GROUP__GET_BY_GROUP_ID',
  GROUP__GET_BY_USER_ID = 'GROUP__GET_BY_USER_ID',
  GROUP__GET_BY_FACULTY_ID = 'GROUP__GET_BY_FACULTY_ID',
  GROUP__GET_MANY = 'GROUP__GET_MANY',
  GROUP__UPDATE = 'GROUP__UPDATE',
  GROUP__DELETE = 'GROUP__DELETE',
}

enumKeyValuesMatch(FunctionalityCodesEnum)
