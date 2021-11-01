import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { MongoIdString } from '../../global/types'
import { FunctionalityDefault } from '../functionality/functionality.constants'
import { TypesEnum } from '../../global/enums/types.enum'
import { DbModelsEnum } from '../../global/enums/dbModelsEnum'

export enum GetGroupsEnum {
  groupId,
  userId,
  facultyId,
  many,
}

export enum GroupRoutesEnum {
  CREATE = '/',
  GET_BY_GROUP_ID = '/',
  GET_BY_GROUP_IDS = '/by-ids',
  GET_BY_FACULTY_ID = '/by-faculty-id',
  GET_MANY = '/many',
  UPDATE = '/',
  DELETE = '/',
}

export enum GroupGetQueryParametersEnum {
  GROUP_ID = 'groupId',
  GROUP_IDS = 'groupIds',
  USER_ID = 'userId',
  FACULTY_ID = 'facultyId',
  PAGE = 'page',
  COUNT = 'count',
  TITLE = 'title',
  FIELDS = 'fields',
}

export enum GroupFieldsEnum {
  title = 'title',
  faculty = 'faculty',
  lastScheduleUpdate = 'lastScheduleUpdate',
  isHaveSchedule = 'isHaveSchedule',
}

export const GroupAdditionalFieldsEnum = {
  ...DefaultFieldsEnum,
}

export type GroupField = keyof typeof GroupFieldsEnum

enumKeyValuesMatch(GroupFieldsEnum)

export interface GroupCreateDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, на которые можно создать группу
  availableFaculties: MongoIdString[] // id факультетов, на которые пользователь может создать группу
  forbiddenFaculties: MongoIdString[] // id факультетов, на которые пользователь НЕ может создать группу
}
export const defaultGroupCreateData: FunctionalityDefault<GroupCreateDataForFunctionality> = {
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

export interface GroupGetByGroupIdDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, группы которых может получить пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может получить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, группы которых пользователь получить НЕ может
  availableGroups: MongoIdString[] // id отдельных групп, которые может получить пользователь
  forbiddenGroups: MongoIdString[] // id отдельных групп, которые пользователь получить НЕ может
}
export const defaultGroupGetByGroupIdData: FunctionalityDefault<GroupGetByGroupIdDataForFunctionality> = {
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

export interface GroupGetByGroupIdsDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, группы которых может получить пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может получить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, группы которых пользователь получить НЕ может
  availableGroups: MongoIdString[] // id отдельных групп, которые может получить пользователь
  forbiddenGroups: MongoIdString[] // id отдельных групп, которые пользователь получить НЕ может
}
export const defaultGroupGetByGroupIdsData: FunctionalityDefault<GroupGetByGroupIdsDataForFunctionality> = {
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

export interface GroupGetByFacultyIdDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетоВ, группы которых может получить пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может получить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, группы которых пользователь получить НЕ может
  availableGroups: MongoIdString[] // id групп, которые пользователь может получить
  forbiddenGroups: MongoIdString[] // id групп, которые пользователь получить НЕ может
}
export const defaultGroupGetByFacultyIdData: FunctionalityDefault<GroupGetByFacultyIdDataForFunctionality> = {
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

export interface GroupGetManyDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, группы которых может получить пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может получить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, группы которых пользователь получить НЕ может
  availableGroups: MongoIdString[] // id отдельных групп, которые может получить пользователь
  forbiddenGroups: MongoIdString[] // id отдельных групп, которые пользователь получить НЕ может
}
export const defaultGroupGetManyData: FunctionalityDefault<GroupGetManyDataForFunctionality> = {
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

export interface GroupUpdateDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность  факультетов, группы которых может обновлять пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может обновлять пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, группы которых пользователь обновить НЕ может
  availableGroups: MongoIdString[] // id отдельных групп, которые может обновлять пользователь
  forbiddenGroups: MongoIdString[] // id отдельных групп, которые пользователь обновлять НЕ может
}
export const defaultGroupUpdateData: FunctionalityDefault<GroupUpdateDataForFunctionality> = {
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

export interface GroupDeleteDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, группы которых может удалять пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может удалять пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, группы которых пользователь удалить не может
  availableGroups: MongoIdString[] // id отдельных групп, которые может удалять пользователь
  forbiddenGroups: MongoIdString[] // id отдельных групп, которые пользователь удалять НЕ может
}
export const defaultGroupDeleteData: FunctionalityDefault<GroupDeleteDataForFunctionality> = {
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
