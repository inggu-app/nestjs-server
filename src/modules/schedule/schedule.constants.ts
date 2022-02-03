import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

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

enumKeyValuesMatch(LessonFieldsEnum)

export enum WeeksTypeEnum {
  WEEKS,
  FIRST,
  SECOND,
  ALL,
}
