import { Types } from 'mongoose'
import { EmptyEnum } from './other.constants'
import { DeviceId } from '../types'
import { getEnumValues } from '../utils/enumKeysValues'

export const INVALID_MONGO_ID = 'Некорретный id'
export const INVALID_DATE = 'Дата должна быть в формате yyyy-MM-ddThh:mm:ss.SSSZ'
export const INVALID_OS = 'Некорректная операционная система'
export const INVALID_APP_VERSION = 'Некорректный формат версии. Необходимый формат: d.d.d'
export const INCORRECT_INT = 'Некорректное значение целого числа'
export const INCORRECT_STRING = 'Некорректное значение строки'
export const FIELDS_QUERY_PARAMETER_IS_EMPTY = 'Поле fields не должно быть пустым'
export const UNNECESSARY_SYMBOLS_IN_QUERY_PARAMETER = (parameter: string, symbols: string) =>
  `В значении query-параметра ${parameter} обнаружены лишние символы - ${symbols}`
export const NOT_EXISTS_FIELD_IN_FIELDS_QUERY_PARAMETER = (field: string, availableFields: string[]) =>
  `Поле "${field}" не существует. Доступные поля: ${availableFields.join(', ')}`
export const INCORRECT_FIELDS_SET_IN_FIELDS_QUERY_PARAMETER = 'Набор таких параметров не найден. Проверьте документацию'
export const VALUE_IS_NOT_INCLUDES_IN_ENUM = (e: EmptyEnum) => `Значение не соответствует одному из ${getEnumValues(e).join(', ')}`

export const FACULTY_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Факультета с id "${id}" не существует`
export const FACULTY_WITH_TITLE_EXISTS = (title: string) => `Факультет с названием "${title}" уже существует`

export const GROUP_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Группа с id "${id}" не существует`
export const GROUP_WITH_TITLE_EXISTS = (title: string) => `Группа с названием "${title}" уже существует`

export const LESSON_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Занятие с id ${id} не существует`

export const NOTE_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Заметки с id "${id}" не существует`
export const INVALID_NOTE_DEVICE_ID = (id: Types.ObjectId, deviceId: DeviceId) =>
  `Заметка c id ${id} создана не устройством с deviceId ${deviceId}`

export const SEMESTER_RANGE_DATE_INCORRECT_RANGE = `Некорректный промежуток дат`
