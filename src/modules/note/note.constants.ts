import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { MongoIdString } from '../../global/types'
import { FunctionalityDefault } from '../functionality/functionality.constants'
import { TypesEnum } from '../../global/enums/types.enum'
import { DbModelsEnum } from '../../global/enums/dbModelsEnum'

export enum NoteRoutesEnum {
  CREATE = '/',
  GET_BY_NOTE_ID = '/by-note-id',
  GET_BY_LESSON_ID = '/by-lesson-id',
  DELETE = '/',
}

export enum NoteGetQueryParametersEnum {
  NOTE_ID = 'noteId',
  LESSON_ID = 'lessonId',
  WEEK = 'week',
  FIELDS = 'fields',
}

export enum NoteFieldsEnum {
  content = 'content',
  deviceId = 'deviceId',
  week = 'week',
  lesson = 'lesson',
}

export enum NoteForbiddenFieldsEnum {
  deviceId = 'deviceId',
}

export enum NoteAdditionalFieldsEnum {
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export type NoteField = keyof typeof NoteFieldsEnum

export enum GetNotesEnum {
  BY_LESSON_ID,
  BY_NOTE_ID,
}

enumKeyValuesMatch(NoteFieldsEnum)
enumKeyValuesMatch(NoteAdditionalFieldsEnum)
enumKeyValuesMatch(NoteForbiddenFieldsEnum)

export interface NoteCreateDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, занятиям групп которых пользователь может добавлять заметки
  availableFaculties: MongoIdString[] // id факультетов, занятиям групп которых пользователь может добавлять заметки
  forbiddenFaculties: MongoIdString[] // id факультетов, занятиям групп которых пользователь НЕ может добавлять заметки
  availableGroups: MongoIdString[] // id групп, занятиям которых пользователь может назначать заметки
  forbiddenGroups: MongoIdString[] // id групп, занятиям которых пользователь НЕ может назначать заметки
}
export const defaultNoteCreateData: FunctionalityDefault<NoteCreateDataForFunctionality> = {
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
  availableGroups: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.GROUP_MODEL,
  },
  forbiddenGroups: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.GROUP_MODEL,
  },
}

export interface NoteGetByNoteIdDataForFunctionality {
  availableGroupsType: FunctionalityAvailableTypeEnum // доступность групп, заметки занятий которых может получить пользователь
  availableGroups: MongoIdString[] // id групп, заметки занятий которых может получить пользователь
  forbiddenGroups: MongoIdString[] // id групп, заметки занятий которых НЕ может получить пользователь
}
export const defaultNoteGetByNoteIdData: FunctionalityDefault<NoteGetByNoteIdDataForFunctionality> = {
  availableGroupsType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableGroups: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.GROUP_MODEL,
  },
  forbiddenGroups: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.GROUP_MODEL,
  },
}

export interface NoteGetByLessonIdDataForFunctionality {
  availableGroupsType: FunctionalityAvailableTypeEnum // доступность групп, заметки занятий которых может получить пользователь
  availableGroups: MongoIdString[] // id групп, заметки занятий которых может получить пользователь
  forbiddenGroups: MongoIdString[] // id групп, заметки занятий которых НЕ может получить пользователь
}
export const defaultNoteGetByLessonIdData: FunctionalityDefault<NoteGetByLessonIdDataForFunctionality> = {
  availableGroupsType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableGroups: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.GROUP_MODEL,
  },
  forbiddenGroups: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.GROUP_MODEL,
  },
}

export interface NoteDeleteDataForFunctionality {
  availableGroupsType: FunctionalityAvailableTypeEnum // доступность групп, заметки занятий которых может удалить пользователь
  availableGroups: MongoIdString[] // id групп, заметки занятий которых может удалить пользователь
  forbiddenGroups: MongoIdString[] // id групп, заметки занятий которых НЕ может удалить пользователь
}
export const defaultNoteDeleteData: FunctionalityDefault<NoteDeleteDataForFunctionality> = {
  availableGroupsType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableGroups: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.GROUP_MODEL,
  },
  forbiddenGroups: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.GROUP_MODEL,
  },
}
