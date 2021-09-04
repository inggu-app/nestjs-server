import { Types } from 'mongoose'

export const GROUP_EXISTS = 'Группа с таким названием уже существует'
export const GROUP_NOT_FOUND = 'Группы с таким id не существует'
export const GROUP_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Группа с id ${id} не существует`

export enum GetGroupsEnum {
  groupId,
  responsibleId,
  facultyId,
  all,
}
