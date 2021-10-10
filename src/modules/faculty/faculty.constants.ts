import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { MongoIdString } from '../../global/types'

export enum FacultyRoutesEnum {
  CREATE = '/',
  GET_BY_FACULTY_ID = '/by-faculty-id',
  GET_MANY = '/many',
  UPDATE = '/',
  DELETE = '/',
}

export enum FacultyGetQueryParametersEnum {
  FACULTY_ID = 'facultyId',
  PAGE = 'page',
  COUNT = 'count',
  TITLE = 'title',
  FIELDS = 'fields',
}

export enum GetFacultiesEnum {
  facultyId,
  many,
}

export enum FacultyFieldsEnum {
  title = 'title',
}

export const FacultyAdditionalFieldsEnum = {
  ...DefaultFieldsEnum,
}
export type FacultyField = keyof typeof FacultyFieldsEnum
enumKeyValuesMatch(FacultyFieldsEnum)

export interface FacultyCreateDataForFunctionality {}

export interface FacultyGetByFacultyIdDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, которые пользователь может получить
  availableFaculties: MongoIdString[] // id факультетов, которые может получить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, которые пользователь получить НЕ может
}

export interface FacultyGetManyDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, которые пользователь может получить
  availableFaculties: MongoIdString[] // id факультетов, которые может получить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, которые пользователь получить НЕ может
}

export interface FacultyUpdateDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, которые пользователь может изменить
  availableFaculties: MongoIdString[] // id факультетов, которые может изменить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, которые пользователь изменить НЕ может
}

export interface FacultyDeleteDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, которые пользователь может удалить
  availableFaculties: MongoIdString[] // id факультетов, которые может удалить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, которые пользователь удалить НЕ может
}
