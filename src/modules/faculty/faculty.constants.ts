import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

export enum FacultyRoutesEnum {
  CREATE = '/',
  GET_BY_FACULTY_ID = '/',
  GET_BY_FACULTY_IDS = '/by-ids',
  GET_MANY = '/many',
  UPDATE = '/',
  DELETE = '/',
}

export enum FacultyGetQueryParametersEnum {
  FACULTY_ID = 'facultyId',
  FACULTY_IDS = 'facultyIds',
  PAGE = 'page',
  COUNT = 'count',
  TITLE = 'title',
}

export enum FacultyFieldsEnum {
  title = 'title',
}

enumKeyValuesMatch(FacultyFieldsEnum)
