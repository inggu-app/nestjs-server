import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'

export enum GetFacultiesEnum {
  facultyId,
  all,
}

export enum FacultyFieldsEnum {
  title = 'title',
}

export const FacultyAdditionalFieldsEnum = {
  ...DefaultFieldsEnum,
}

export type FacultyField = keyof typeof FacultyFieldsEnum

enumKeyValuesMatch(FacultyFieldsEnum)
