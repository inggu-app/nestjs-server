import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFields } from '../../global/enums/defaultFields'

export const FACULTY_EXISTS = 'Факультет с таким названием уже существует'
export const FACULTY_NOT_FOUND = 'Факультета с таким id не существует'

export enum GetFacultiesEnum {
  facultyId,
  all,
}

export enum FacultyFieldsEnum {
  title = 'title',
}

export const FacultyAdditionalFieldsEnum = {
  ...DefaultFields,
}

export type FacultyField = keyof typeof FacultyFieldsEnum

enumKeyValuesMatch(FacultyFieldsEnum)
