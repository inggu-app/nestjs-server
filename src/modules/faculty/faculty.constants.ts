import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFields } from '../../global/enums/defaultFields'

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
