export const GROUP_NOT_FOUND = 'Группы с таким id не существует'
export const SCHEDULE_EXISTS =
  'Расписание для этой группы уже существует. Попробуйте обновить расписание'

import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

export enum GetScheduleEnum {
  groupId,
}

export enum ScheduleFieldsEnum {
  title = 'title',
  teacher = 'teacher',
  number = 'number',
  classroom = 'classroom',
  weekDay = 'weekDay',
  weeks = 'weeks',
  type = 'type',
  group = 'group',
}

export enum ScheduleAdditionalFieldsEnum {
  startTime = 'startTime',
  endTime = 'endTime',
}

export type ScheduleField =
  | keyof typeof ScheduleFieldsEnum
  | keyof typeof ScheduleAdditionalFieldsEnum

enumKeyValuesMatch(ScheduleFieldsEnum)
enumKeyValuesMatch(ScheduleAdditionalFieldsEnum)
