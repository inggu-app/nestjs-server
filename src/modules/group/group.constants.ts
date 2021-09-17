import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFields } from '../../global/enums/defaultFields'

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
  ...DefaultFields,
}

export type GroupField = keyof typeof GroupFieldsEnum

enumKeyValuesMatch(GroupFieldsEnum)
