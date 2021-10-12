import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'
import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { MongoIdString } from '../../global/types'

export enum ScheduleRoutesEnum {
  CREATE = '/',
  GET_BY_GROUP_ID = '/by-group-id',
}

export enum ScheduleGetQueryParametersEnum {
  GROUP_ID = 'groupId',
  UPDATED_AT = 'updatedAt',
  FIELDS = 'fields',
}

export enum GetScheduleEnum {
  groupId,
}

export enum LessonFieldsEnum {
  title = 'title',
  teacher = 'teacher',
  number = 'number',
  classroom = 'classroom',
  weekDay = 'weekDay',
  weeksType = 'weeksType',
  weeks = 'weeks',
  type = 'type',
  group = 'group',
  subgroup = 'subgroup',
}

export enum _ScheduleAdditionalFieldsEnum {
  startTime = 'startTime',
  endTime = 'endTime',
}

export const ScheduleAdditionalFieldsEnum = {
  ..._ScheduleAdditionalFieldsEnum,
  ...DefaultFieldsEnum,
}

export type ScheduleField = keyof typeof LessonFieldsEnum | keyof typeof _ScheduleAdditionalFieldsEnum | 'id'

enumKeyValuesMatch(LessonFieldsEnum)
enumKeyValuesMatch(_ScheduleAdditionalFieldsEnum)

export enum WeeksTypeEnum {
  WEEKS,
  FIRST,
  SECOND,
}

export interface ScheduleCreateDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, группам которых пользователь может создавать или обновлять расписание
  availableFaculties: MongoIdString[] // id факультетов, группам которых пользователь может создавать или обновлять расписание
  availableGroups: MongoIdString[] // id групп, для которых пользователь может создавать или обновлять расписание
  forbiddenGroups: MongoIdString[] // id групп, для которых пользователь создавать или обновлять расписание НЕ может
}
export const defaultScheduleCreateData: ScheduleCreateDataForFunctionality = {
  availableFacultiesType: FunctionalityAvailableTypeEnum.ALL,
  availableFaculties: [],
  availableGroups: [],
  forbiddenGroups: [],
}

export interface ScheduleGetByGroupIdDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, расписание групп которых пользователь может получить
  availableFaculties: MongoIdString[] // id факультетов, расписание групп которых пользователь может получить
  availableGroups: MongoIdString[] // id групп, расписание которых пользователь может получить
  forbiddenGroups: MongoIdString[] // id групп, расписание которых пользователь получить НЕ может
}
export const defaultScheduleGetByGroupIdData: ScheduleGetByGroupIdDataForFunctionality = {
  availableFacultiesType: FunctionalityAvailableTypeEnum.ALL,
  availableFaculties: [],
  availableGroups: [],
  forbiddenGroups: [],
}
