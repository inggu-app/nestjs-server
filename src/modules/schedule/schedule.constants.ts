import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'
import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { MongoIdString } from '../../global/types'
import { FunctionalityDefault } from '../functionality/functionality.constants'
import { TypesEnum } from '../../global/enums/types.enum'
import { DbModelsEnum } from '../../global/enums/dbModelsEnum'

export enum ScheduleRoutesEnum {
  CREATE = '/',
  GET_BY_GROUP_ID = '/by-group-id',
}

export enum ScheduleGetQueryParametersEnum {
  GROUP_ID = 'groupId',
  UPDATED_AT = 'updatedAt',
  FIELDS = 'fields',
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
  ALL,
}

export interface ScheduleCreateDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, группам которых пользователь может создавать или обновлять расписание
  availableFaculties: MongoIdString[] // id факультетов, группам которых пользователь может создавать или обновлять расписание
  forbiddenFaculties: MongoIdString[] // id факультетов, группам которых пользователь НЕ может создавать или обновлять расписание
  availableGroups: MongoIdString[] // id групп, для которых пользователь может создавать или обновлять расписание
  forbiddenGroups: MongoIdString[] // id групп, для которых пользователь создавать или обновлять расписание НЕ может
}
export const defaultScheduleCreateData: FunctionalityDefault<ScheduleCreateDataForFunctionality> = {
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

export interface ScheduleGetByGroupIdDataForFunctionality {
  availableFacultiesType: FunctionalityAvailableTypeEnum // доступность факультетов, расписание групп которых пользователь может получить
  availableFaculties: MongoIdString[] // id факультетов, расписание групп которых пользователь может получить
  forbiddenFaculties: MongoIdString[] // id факультетов, расписание групп которых пользователь НЕ может получить
  availableGroups: MongoIdString[] // id групп, расписание которых пользователь может получить
  forbiddenGroups: MongoIdString[] // id групп, расписание которых пользователь получить НЕ может
}
export const defaultScheduleGetByGroupIdData: FunctionalityDefault<ScheduleGetByGroupIdDataForFunctionality> = {
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
