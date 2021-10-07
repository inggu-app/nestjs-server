import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { MongoIdString } from '../../global/types'

export enum GetGroupsEnum {
  groupId,
  responsibleId,
  facultyId,
  all,
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
  | FunctionalityCodesEnum.GROUP__GET
  | FunctionalityCodesEnum.GROUP__UPDATE
  | FunctionalityCodesEnum.GROUP__DELETE

export interface GroupCreateDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, на которые можно создать группу
  availableFaculties: MongoIdString[] // id факультетов, на которые пользователь может создать группу
}

export interface GroupGetDataForFunctionality {
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
