import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

export enum NoteRoutesEnum {
  CREATE = '/',
  GET_BY_NOTE_ID = '/by-note-id',
  GET_BY_LESSON_ID = '/by-lesson-id',
  DELETE = '/',
}

export enum NoteGetQueryParametersEnum {
  NOTE_ID = 'noteId',
  LESSON_ID = 'lessonId',
  WEEK = 'week',
}

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

enumKeyValuesMatch(NoteFieldsEnum)
enumKeyValuesMatch(NoteAdditionalFieldsEnum)
enumKeyValuesMatch(NoteForbiddenFieldsEnum)
