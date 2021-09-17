import { Types } from 'mongoose'

export const INVALID_MONGO_ID = 'Некорретный id'
export const INVALID_DATE = 'Дата должна быть в формате yyyy-MM-ddThh:mm:ss.SSSZ'
export const INVALID_OS = 'Некорректная операционная система'
export const INVALID_APP_VERSION = 'Некорректный формат версии. Необходимый формат: d.d.d'
export const INCORRECT_CREDENTIALS = 'Неправильные логин или пароль'
export const INCORRECT_PAGE_COUNT_QUERIES =
  'Параметры должны либо одновременно иметь или не иметь значение -1'
export const INCORRECT_INT = 'Некорректное значение целого числа'
export const FIELDS_QUERY_PARAMETER_IS_EMPTY = 'Поле fields не должно быть пустым'
export const UNNECESSARY_SYMBOLS_IN_FIELDS_QUERY_PARAMETER = (symbols: string) =>
  `В значении query-параметра fields обнаружены лишние символы - ${symbols}`
export const NOT_EXISTS_FIELD_IN_FIELDS_QUERY_PARAMETER = (field: string) =>
  `Поле "${field}" не существует`
export const INCORRECT_FIELDS_SET_IN_FIELDS_QUERY_PARAMETER =
  'Набор таких параметров не найден. Проверьте документацию'

export const ADMIN_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Админ с id "${id}" не существует`
export const ADMIN_WITH_LOGIN_EXISTS = (login: string) =>
  `Админ с логином "${login}" уже существует`
export const ADMIN_WITH_LOGIN_NOT_FOUND = (login: string) =>
  `Админ с логином "${login}" не существует`

export const FACULTY_WITH_ID_NOT_FOUND = (id: Types.ObjectId) =>
  `Факультета с id "${id}" не существует`
export const FACULTY_WITH_TITLE_EXISTS = (title: string) =>
  `Факультет названием "${title}" уже существует`

export const GROUP_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Группа с id "${id}" не существует`
export const GROUP_WITH_TITLE_EXISTS = (title: string) =>
  `Группа сназванием "${title}" уже существует`

export const RESPONSIBLE_WITH_ID_NOT_FOUND = (id: Types.ObjectId) =>
  `Ответственный с id "${id}" не существует`
export const RESPONSIBLE_WITH_LOGIN_EXISTS = (login: string) =>
  `Ответственный с логином "${login}" уже существует`
