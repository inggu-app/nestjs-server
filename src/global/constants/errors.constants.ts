import { Types } from 'mongoose'
import { EmptyEnum } from './other.constants'
import { DeviceId, MongoIdString } from '../types'
import { getEnumValues } from '../utils/enumKeysValues'
import { FunctionalityCodesEnum } from '../enums/functionalities.enum'

export const INVALID_MONGO_ID = 'Некорретный id'
export const INVALID_DATE = 'Дата должна быть в формате yyyy-MM-ddThh:mm:ss.SSSZ'
export const INVALID_OS = 'Некорректная операционная система'
export const INVALID_APP_VERSION = 'Некорректный формат версии. Необходимый формат: d.d.d'
export const INCORRECT_CREDENTIALS = 'Неправильные логин или пароль'
export const INCORRECT_INT = 'Некорректное значение целого числа'
export const INCORRECT_STRING = 'Некорректное значение строки'
export const FIELDS_QUERY_PARAMETER_IS_EMPTY = 'Поле fields не должно быть пустым'
export const UNNECESSARY_SYMBOLS_IN_QUERY_PARAMETER = (parameter: string, symbols: string) =>
  `В значении query-параметра ${parameter} обнаружены лишние символы - ${symbols}`
export const NOT_EXISTS_FIELD_IN_FIELDS_QUERY_PARAMETER = (field: string, availableFields: string[]) =>
  `Поле "${field}" не существует. Доступные поля: ${availableFields.join(', ')}`
export const INCORRECT_FIELDS_SET_IN_FIELDS_QUERY_PARAMETER = 'Набор таких параметров не найден. Проверьте документацию'
export const VALUE_IS_NOT_INCLUDES_IN_ENUM = (e: EmptyEnum) => `Значение не соответствует одному из ${getEnumValues(e).join(', ')}`

export const ADMIN_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Админ с id "${id}" не существует`
export const ADMIN_WITH_LOGIN_EXISTS = (login: string) => `Админ с логином "${login}" уже существует`

export const FACULTY_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Факультета с id "${id}" не существует`
export const FACULTY_WITH_TITLE_EXISTS = (title: string) => `Факультет с названием "${title}" уже существует`

export const GROUP_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Группа с id "${id}" не существует`
export const GROUP_WITH_TITLE_EXISTS = (title: string) => `Группа с названием "${title}" уже существует`

export const RESPONSIBLE_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Ответственный с id "${id}" не существует`
export const RESPONSIBLE_WITH_LOGIN_EXISTS = (login: string) => `Ответственный с логином "${login}" уже существует`

export const LESSON_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Занятие с id ${id} не существует`

export const NOTE_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Заметки с id "${id}" не существует`
export const INVALID_NOTE_DEVICE_ID = (id: Types.ObjectId, deviceId: DeviceId) =>
  `Заметка c id ${id} создана не устройством с deviceId ${deviceId}`

export const ROLE_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Роль с id "${id}" не существует`
export const ROLE_WITH_TITLE_EXISTS = (title: string) => `Роль с названием "${title}" уже существует`
export const ROLE_WITH_CODE_NOT_FOUND = (code: string) => `Роль с кодом ${code} не найдена`
export const ROLE_EXTRA_FIELDS = (fields: (string | number)[]) => `Лишние поля в роли: ${fields.join(', ')}`
export const ROLE_MISSING_FIELDS = (fields: (string | number)[]) => `Недостающие поля в роли: ${fields.join(', ')}`
export const ROLE_INCORRECT_FIELD_TYPE = (field: string | number) => `Для поля ${field} задан неправильный тип`
export const ROLE_INCORRECT_FIELD_MODEL = (field: string | number) => `Для поля ${field} задана некорректная модель`
export const ROLE_INCORRECT_FIELD_VALUE = (model: string, value: string) => `В модели ${model} не существует документа с id ${value}`

export const USER_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Пользователь с id "${id}" не существует`
export const USER_WITH_LOGIN_NOT_FOUND = (login: string) => `Пользователь с логином "${login}" не существует`
export const USER_WITH_LOGIN_EXISTS = (login: string) => `Пользователь с логином "${login}" уже существует`
export const USER_HAS_NO_ROLE_WITH_ID = (roleId: Types.ObjectId | MongoIdString) => `Пользователь не имеет роли с id ${roleId}`

export const INTERFACE_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Интерфейс с id ${id} не найден`
export const INTERFACE_WITH_CODE_NOT_FOUND = (code: string) => `Интерфейс с кодом ${code} не найден`
export const INTERFACE_WITH_CODE_EXISTS = (code: string) => `Интерфейс с кодом ${code} уже существует`

export const VIEW_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Отображение с id ${id} не найдено`
export const VIEW_WITH_CODE_NOT_FOUND = (code: string) => `Отображение с кодом ${code} не найдено`
export const VIEW_WITH_CODE_EXISTS = (code: string) => `Отображение с кодом ${code} уже существует`

export const FUNCTIONALITY_WITH_CODE_NOT_FOUND = (code: string) => `Функциональность с кодом ${code} не найдена`
export const FUNCTIONALITY_EXTRA_FIELDS = (functionalityCode: FunctionalityCodesEnum, fields: (string | number)[]) =>
  `Лишние поля в функциональности: ${fields.join(', ')}`
export const FUNCTIONALITY_MISSING_FIELDS = (functionalityCode: FunctionalityCodesEnum, fields: (string | number)[]) =>
  `Недостающие поля в функциональности: ${fields.join(', ')}`
export const FUNCTIONALITY_INCORRECT_FIELD_TYPE = (field: string | number) => `Для поля ${field} задан неправильный тип`
export const FUNCTIONALITY_INCORRECT_FIELD_VALUE = (model: string, value: string) =>
  `В модели ${model} не существует документа с id ${value}`
