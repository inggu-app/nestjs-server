import { Types } from 'mongoose'
import { DeviceId } from '../types'

export const INVALID_MONGO_ID = 'Некорретный id'
export const INVALID_DATE = 'Дата должна быть в формате yyyy-MM-ddThh:mm:ss.SSSZ'
export const INVALID_OS = 'Некорректная операционная система'
export const INVALID_APP_VERSION = 'Некорректный формат версии. Необходимый формат: d.d.d'
export const INCORRECT_INT = 'Некорректное значение целого числа'
export const INCORRECT_STRING = 'Некорректное значение строки'
export const UNNECESSARY_SYMBOLS_IN_QUERY_PARAMETER = (parameter: string, symbols: string) =>
  `В значении query-параметра ${parameter} обнаружены лишние символы - ${symbols}`

export const FACULTY_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Факультета с id "${id}" не существует`
export const FACULTY_WITH_TITLE_EXISTS = (title: string) => `Факультет с названием "${title}" уже существует`

export const GROUP_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Группа с id "${id}" не существует`
export const GROUP_WITH_TITLE_EXISTS = (title: string) => `Группа с названием "${title}" уже существует`

export const LESSON_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Занятие с id ${id} не существует`

export const NOTE_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Заметки с id "${id}" не существует`
export const INVALID_NOTE_DEVICE_ID = (id: Types.ObjectId, deviceId: DeviceId) =>
  `Заметка c id ${id} создана не устройством с deviceId ${deviceId}`

export const ADMIN_USER_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Админ с id ${id} не существует`
export const ADMIN_USER_WITH_LOGIN_EXISTS = (login: string) => `Админ с логином ${login} уже существует`

export const SEMESTER_RANGE_DATE_INCORRECT_RANGE = `Некорректный промежуток дат`
