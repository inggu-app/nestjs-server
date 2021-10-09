import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { MongoIdString } from '../../global/types'

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

export type GroupFunctionalityCodesEnum =
  | FunctionalityCodesEnum.GROUP__CREATE
  | FunctionalityCodesEnum.GROUP__GET_BY_GROUP_ID
  | FunctionalityCodesEnum.GROUP__GET_BY_USER_ID
  | FunctionalityCodesEnum.GROUP__GET_BY_FACULTY_ID
  | FunctionalityCodesEnum.GROUP__GET_MANY
  | FunctionalityCodesEnum.GROUP__UPDATE
  | FunctionalityCodesEnum.GROUP__DELETE

export interface GroupCreateDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, на которые можно создать группу
  availableFaculties: MongoIdString[] // id факультетов, на которые пользователь может создать группу
}

export interface GroupGetByGroupIdDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, группы которых может получить пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может получить пользователь
  availableGroups: MongoIdString[] // id отдельных групп, которые может получить пользователь
  forbiddenGroups: MongoIdString[] // id отдельных групп, которые пользователь получить НЕ может
}

export interface GroupGetByUserIdDataForFunctionality {
  availableUsersType: FunctionalityAvailableTypeEnum // доступность пользователей, список групп которых может получить пользователь
  availableUsers: MongoIdString[] // id пользователей, список групп которых может получить пользователь
}

export interface GroupGetByFacultyIdDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетоВ, группы которых может получить пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может получить пользователь
}

export interface GroupGetManyDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, группы которых может получить пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может получить пользователь
  availableGroups: MongoIdString[] // id отдельных групп, которые может получить пользователь
  forbiddenGroups: MongoIdString[] // id отдельных групп, которые пользователь получить НЕ может
}

export interface GroupUpdateDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность  факультетов, группы которых может обновлять пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может обновлять пользователь
  availableGroups: MongoIdString[] // id отдельных групп, которые может обновлять пользователь
  forbiddenGroups: MongoIdString[] // id отдельных групп, которые пользователь обновлять НЕ может
}

export interface GroupDeleteDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, группы которых может удалять пользователь
  availableFaculties: MongoIdString[] // id факультетов, группы которых может удалять пользователь
  availableGroups: MongoIdString[] // id отдельных групп, которые может удалять пользователь
  forbiddenGroups: MongoIdString[] // id отдельных групп, которые пользователь удалять НЕ может
}
