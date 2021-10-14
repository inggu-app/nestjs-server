import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { MongoIdString } from '../../global/types'
import { FunctionalityDefault } from '../functionality/functionality.constants'
import { TypesEnum } from '../../global/enums/types.enum'

export enum GetGroupsEnum {
  groupId,
  userId,
  facultyId,
  many,
}

export enum GroupRoutesEnum {
  CREATE = '/',
  GET_BY_GROUP_ID = '/by-group-id',
  GET_BY_USER_ID = '/by-user-id',
  GET_BY_FACULTY_ID = '/by-faculty-id',
  GET_MANY = '/many',
  UPDATE = '/',
  DELETE = '/',
}

export enum GroupGetQueryParametersEnum {
  GROUP_ID = 'groupId',
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
  availableFacultiesType: FunctionalityAvailableTypeEnum.ALL,
  availableFaculties: TypesEnum.MONGO_ID_ARRAY,
  forbiddenFaculties: TypesEnum.MONGO_ID_ARRAY,
}

export interface GroupGetByGroupIdDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, группы которых может получить пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может получить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, группы которых пользователь получить НЕ может
  availableGroups: MongoIdString[] // id отдельных групп, которые может получить пользователь
  forbiddenGroups: MongoIdString[] // id отдельных групп, которые пользователь получить НЕ может
}
export const defaultGroupGetByGroupIdData: FunctionalityDefault<GroupGetByGroupIdDataForFunctionality> = {
  availableFacultiesType: FunctionalityAvailableTypeEnum.ALL,
  availableFaculties: TypesEnum.MONGO_ID_ARRAY,
  forbiddenFaculties: TypesEnum.MONGO_ID_ARRAY,
  availableGroups: TypesEnum.MONGO_ID_ARRAY,
  forbiddenGroups: TypesEnum.MONGO_ID_ARRAY,
}

export interface GroupGetByUserIdDataForFunctionality {
  // TODO: Нужно ли вообще запрашивать список групп для ответственного в этом модуле?
  availableUsersType: FunctionalityAvailableTypeEnum // доступность пользователей, список групп которых может получить пользователь
  availableUsers: MongoIdString[] // id пользователей, список групп которых может получить пользователь
  forbiddenUsers: MongoIdString[] // id пользователей, список групп которых пользователь получить НЕ может
}
export const defaultGroupGetByUserIdData: FunctionalityDefault<GroupGetByUserIdDataForFunctionality> = {
  availableUsersType: FunctionalityAvailableTypeEnum.ALL,
  availableUsers: TypesEnum.MONGO_ID_ARRAY,
  forbiddenUsers: TypesEnum.MONGO_ID_ARRAY,
}

export interface GroupGetByFacultyIdDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетоВ, группы которых может получить пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может получить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, группы которых пользователь получить НЕ может
  availableGroups: MongoIdString[] // id групп, которые пользователь может получить
  forbiddenGroups: MongoIdString[] // id групп, которые пользователь получить НЕ может
}
export const defaultGroupGetByFacultyIdData: FunctionalityDefault<GroupGetByFacultyIdDataForFunctionality> = {
  availableFacultiesType: FunctionalityAvailableTypeEnum.ALL,
  availableFaculties: TypesEnum.MONGO_ID_ARRAY,
  forbiddenFaculties: TypesEnum.MONGO_ID_ARRAY,
  availableGroups: TypesEnum.MONGO_ID_ARRAY,
  forbiddenGroups: TypesEnum.MONGO_ID_ARRAY,
}

export interface GroupGetManyDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, группы которых может получить пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может получить пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, группы которых пользователь получить НЕ может
  availableGroups: MongoIdString[] // id отдельных групп, которые может получить пользователь
  forbiddenGroups: MongoIdString[] // id отдельных групп, которые пользователь получить НЕ может
}
export const defaultGroupGetManyData: FunctionalityDefault<GroupGetManyDataForFunctionality> = {
  availableFacultiesType: FunctionalityAvailableTypeEnum.ALL,
  availableFaculties: TypesEnum.MONGO_ID_ARRAY,
  forbiddenFaculties: TypesEnum.MONGO_ID_ARRAY,
  availableGroups: TypesEnum.MONGO_ID_ARRAY,
  forbiddenGroups: TypesEnum.MONGO_ID_ARRAY,
}

export interface GroupUpdateDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность  факультетов, группы которых может обновлять пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может обновлять пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, группы которых пользователь обновить НЕ может
  availableGroups: MongoIdString[] // id отдельных групп, которые может обновлять пользователь
  forbiddenGroups: MongoIdString[] // id отдельных групп, которые пользователь обновлять НЕ может
}
export const defaultGroupUpdateData: FunctionalityDefault<GroupUpdateDataForFunctionality> = {
  availableFacultiesType: FunctionalityAvailableTypeEnum.ALL,
  availableFaculties: TypesEnum.MONGO_ID_ARRAY,
  forbiddenFaculties: TypesEnum.MONGO_ID_ARRAY,
  availableGroups: TypesEnum.MONGO_ID_ARRAY,
  forbiddenGroups: TypesEnum.MONGO_ID_ARRAY,
}

export interface GroupDeleteDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, группы которых может удалять пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может удалять пользователь
  forbiddenFaculties: MongoIdString[] // id факультетов, группы которых пользователь удалить не может
  availableGroups: MongoIdString[] // id отдельных групп, которые может удалять пользователь
  forbiddenGroups: MongoIdString[] // id отдельных групп, которые пользователь удалять НЕ может
}
export const defaultGroupDeleteData: FunctionalityDefault<GroupDeleteDataForFunctionality> = {
  availableFacultiesType: FunctionalityAvailableTypeEnum.ALL,
  availableFaculties: TypesEnum.MONGO_ID_ARRAY,
  forbiddenFaculties: TypesEnum.MONGO_ID_ARRAY,
  availableGroups: TypesEnum.MONGO_ID_ARRAY,
  forbiddenGroups: TypesEnum.MONGO_ID_ARRAY,
}
