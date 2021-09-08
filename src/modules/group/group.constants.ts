import { Types } from 'mongoose'
import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

export const GROUP_EXISTS = 'Группа с таким названием уже существует'
export const GROUP_NOT_FOUND = 'Группы с таким id не существует'
export const GROUP_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Группа с id ${id} не существует`

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

export type GroupField = keyof typeof GroupFieldsEnum

enumKeyValuesMatch(GroupFieldsEnum)
