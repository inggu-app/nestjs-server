import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

export enum ScheduleRoutesEnum {
  CREATE = '/',
  GET_BY_GROUP_ID = '/by-group-id',
}

export enum ScheduleGetQueryParametersEnum {
  GROUP_ID = 'groupId',
  UPDATED_AT = 'updatedAt',
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

export type ScheduleField = keyof typeof LessonFieldsEnum | keyof typeof _ScheduleAdditionalFieldsEnum | 'id'

enumKeyValuesMatch(LessonFieldsEnum)
enumKeyValuesMatch(_ScheduleAdditionalFieldsEnum)

export enum WeeksTypeEnum {
  WEEKS,
  FIRST,
  SECOND,
  ALL,
}
