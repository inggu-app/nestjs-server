import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { MongoIdString } from '../../global/types'
import { TypesEnum } from '../../global/enums/types.enum'
import { FunctionalityDefault } from '../functionality/functionality.constants'
import { DbModelsEnum } from '../../global/enums/dbModelsEnum'

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
  FIELDS = 'fields',
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
export const defaultFacultyCreateData: FunctionalityDefault<FacultyCreateDataForFunctionality> = {}

export interface FacultyGetByFacultyIdDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, которые пользователь может получить
  availableFaculties: MongoIdString[] // id факультетов, которые может получить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, которые пользователь получить НЕ может
}
export const defaultFacultyGetByFacultyIdData: FunctionalityDefault<FacultyGetByFacultyIdDataForFunctionality> = {
  availableFacultiesType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableFaculties: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.FACULTY_MODEL,
  },
  forbiddenFaculties: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.FACULTY_MODEL,
  },
}

export interface FacultyGetByFacultyIdsDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, которые пользователь может получить
  availableFaculties: MongoIdString[] // id факультетов, которые может получить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, которые пользователь получить НЕ может
}
export const defaultFacultyGetByFacultyIdsData: FunctionalityDefault<FacultyGetByFacultyIdsDataForFunctionality> = {
  availableFacultiesType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableFaculties: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.FACULTY_MODEL,
  },
  forbiddenFaculties: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.FACULTY_MODEL,
  },
}

export interface FacultyGetManyDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, которые пользователь может получить
  availableFaculties: MongoIdString[] // id факультетов, которые может получить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, которые пользователь получить НЕ может
}
export const defaultFacultyGetManyData: FunctionalityDefault<FacultyGetManyDataForFunctionality> = {
  availableFacultiesType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableFaculties: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.FACULTY_MODEL,
  },
  forbiddenFaculties: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.FACULTY_MODEL,
  },
}

export interface FacultyUpdateDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, которые пользователь может изменить
  availableFaculties: MongoIdString[] // id факультетов, которые может изменить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, которые пользователь изменить НЕ может
}
export const defaultFacultyUpdateData: FunctionalityDefault<FacultyUpdateDataForFunctionality> = {
  availableFacultiesType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableFaculties: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.FACULTY_MODEL,
  },
  forbiddenFaculties: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.FACULTY_MODEL,
  },
}

export interface FacultyDeleteDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, которые пользователь может удалить
  availableFaculties: MongoIdString[] // id факультетов, которые может удалить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, которые пользователь удалить НЕ может
}
export const defaultFacultyDeleteData: FunctionalityDefault<FacultyDeleteDataForFunctionality> = {
  availableFacultiesType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableFaculties: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.FACULTY_MODEL,
  },
  forbiddenFaculties: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.FACULTY_MODEL,
  },
}
