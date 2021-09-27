import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

export enum NoteFieldsEnum {
  content = 'content',
  deviceId = 'deviceId',
  week = 'week',
  lesson = 'lesson',
}

export enum NoteForbiddenFieldsEnum {
  deviceId = 'deviceId',
}

export enum NoteAdditionalFieldsEnum {
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export type NoteField = keyof typeof NoteFieldsEnum

export enum GetNotesEnum {
  BY_LESSON,
  BY_ID,
}

enumKeyValuesMatch(NoteFieldsEnum)
enumKeyValuesMatch(NoteAdditionalFieldsEnum)
enumKeyValuesMatch(NoteForbiddenFieldsEnum)
