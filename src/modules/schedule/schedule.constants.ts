import { DefaultFields } from '../../global/enums/defaultFields'
import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

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
}

export enum _ScheduleAdditionalFieldsEnum {
  startTime = 'startTime',
  endTime = 'endTime',
}

export const ScheduleAdditionalFieldsEnum = {
  ..._ScheduleAdditionalFieldsEnum,
  ...DefaultFields,
}

export type ScheduleField =
  | keyof typeof LessonFieldsEnum
  | keyof typeof _ScheduleAdditionalFieldsEnum

enumKeyValuesMatch(LessonFieldsEnum)
enumKeyValuesMatch(_ScheduleAdditionalFieldsEnum)

export enum WeeksTypeEnum {
  WEEKS,
  FIRST,
  SECOND,
}
