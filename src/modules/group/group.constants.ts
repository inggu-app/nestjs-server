import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

export enum GroupFieldsEnum {
  title = 'title',
  faculty = 'faculty',
  lastScheduleUpdate = 'lastScheduleUpdate',
  isHaveSchedule = 'isHaveSchedule',
}

enumKeyValuesMatch(GroupFieldsEnum)
