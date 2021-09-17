import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

export const FACULTY_EXISTS = 'Факультет с таким названием уже существует'
export const FACULTY_NOT_FOUND = 'Факультета с таким id не существует'

export enum GetFacultiesEnum {
  facultyId,
  all,
}

export enum FacultyFieldsEnum {
  title = 'title',
}

export type FacultyField = keyof typeof FacultyFieldsEnum

enumKeyValuesMatch(FacultyFieldsEnum)
