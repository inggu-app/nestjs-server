import enumKeyValuesMatch from '../utils/enumKeyValuesMatch'

export enum FunctionalityCodesEnum {
  FACULTY__CREATE = 'FACULTY__CREATE',
  FACULTY__GET_BY_FACULTY_ID = 'FACULTY__GET_BY_FACULTY_ID',
  FACULTY__GET_BY_FACULTY_IDS = 'FACULTY__GET_BY_FACULTY_IDS',
  FACULTY__GET_MANY = 'FACULTY__GET_MANY',
  FACULTY__UPDATE = 'FACULTY__UPDATE',
  FACULTY__DELETE = 'FACULTY__DELETE',

  GROUP__CREATE = 'GROUP__CREATE',
  GROUP__GET_BY_GROUP_ID = 'GROUP__GET_BY_GROUP_ID',
  GROUP__GET_BY_GROUP_IDS = 'GROUP__GET_BY_GROUP_IDS',
  GROUP__GET_BY_FACULTY_ID = 'GROUP__GET_BY_FACULTY_ID',
  GROUP__GET_MANY = 'GROUP__GET_MANY',
  GROUP__UPDATE = 'GROUP__UPDATE',
  GROUP__DELETE = 'GROUP__DELETE',

  SCHEDULE__CREATE = 'SCHEDULE__CREATE',
  SCHEDULE__GET_BY_GROUP_ID = 'SCHEDULE__GET_BY_GROUP_ID',

  NOTE__CREATE = 'NOTE__CREATE',
  NOTE__GET_BY_NOTE_ID = 'NOTE__GET_BY_NOTE_ID',
  NOTE__GET_BY_LESSON_ID = 'NOTE__GET_BY_LESSON_ID',
  NOTE__DELETE = 'NOTE__DELETE',

  ROLE__CREATE = 'ROLE__CREATE',
  ROLE__GET_BY_ROLE_ID = 'ROLE__GET_BY_ROLE_ID',
  ROLE__GET_MANY = 'ROLE__GET_MANY',
  ROLE__UPDATE = 'ROLE__UPDATE',
  ROLE__DELETE = 'ROLE__DELETE',

  USER__CREATE = 'USER__CREATE',
  USER__GET_BY_USER_ID = 'USER__GET_BY_USER_ID',
  USER__GET_BY_ROLE_ID = 'USER__GET_BY_ROLE_ID',
  USER__GET_MANY = 'USER__GET_MANY',
  USER__UPDATE = 'USER__UPDATE',
  USER__DELETE = 'USER__DELETE',

  FUNCTIONALITIES__GET = 'FUNCTIONALITIES__GET',

  INTERFACE__CREATE = 'INTERFACE__CREATE',
  INTERFACE__GET_BY_CODE = 'INTERFACE__GET_BY_CODE',
  INTERFACE__UPDATE = 'INTERFACE__UPDATE',
  INTERFACE__DELETE = 'INTERFACE__DELETE',

  VIEW__CREATE = 'VIEW__CREATE',
  VIEW__GET_BY_CODE = 'VIEW__GET_BY_CODE',
  VIEW__GET_BY_USER_ID = 'VIEW__GET_BY_USER_ID',
  VIEW__UPDATE = 'VIEW__UPDATE',
  VIEW__DELETE = 'VIEW__DELETE',

  APP_VERSION__CREATE = 'APP_VERSION__CREATE',
  APP_VERSION__POST_FEATURES = 'APP_VERSION__POST_FEATURES',
  APP_VERSION__GET = 'APP_VERSION__GET',
  APP_VERSION__CHECK = 'APP_VERSION__CHECK',
  APP_VERSION__DELETE = 'APP_VERSION__DELETE',

  CALL_SCHEDULE__CREATE = 'CALL_SCHEDULE__CREATE',
  CALL_SCHEDULE__GET = 'CALL_SCHEDULE__GET',

  SECRET_LABEL__CREATE = 'SECRET_LABEL__CREATE',
  SECRET_LABEL__GET = 'SECRET_LABEL__GET',

  SEMESTER_RANGE__CREATE = 'SEMESTER_RANGE__CREATE',
  SEMESTER_RANGE__GET = 'SEMESTER_RANGE__GET',
}

enumKeyValuesMatch(FunctionalityCodesEnum)
