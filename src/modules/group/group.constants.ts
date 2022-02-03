import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

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

enumKeyValuesMatch(GroupFieldsEnum)
