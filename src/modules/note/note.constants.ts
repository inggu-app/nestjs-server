import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

export enum NoteFieldsEnum {
  content = 'content',
  deviceId = 'deviceId',
  group = 'group',
  week = 'week',
  weekDay = 'weekDay',
  lessonNumber = 'lessonNumber',
}

export enum NoteForbiddenFieldsEnum {
  deviceId = 'deviceId',
}

export type NoteField = keyof typeof NoteFieldsEnum

export enum GetNotesEnum {
  BY_LESSON,
  BY_ID,
}

enumKeyValuesMatch(NoteForbiddenFieldsEnum)
enumKeyValuesMatch(NoteFieldsEnum)
