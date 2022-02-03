import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

export enum NoteFieldsEnum {
  content = 'content',
  deviceId = 'deviceId',
  week = 'week',
  lesson = 'lesson',
}

enumKeyValuesMatch(NoteFieldsEnum)
