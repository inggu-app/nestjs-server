import { Types } from 'mongoose'
import { DeviceId } from '../types'
import { OperationSystem } from '../enums/OS.enum'

export const INVALID_MONGO_ID = (id: string) => `Некорретный id ${id}`
export const QUERY_PARAMETER_IS_REQUIRED = (parameter: string) => `Параметр ${parameter} обязателен`
export const QUERY_PARAMETER_IS_EMPTY = (parameter: string) => `Значение параметра ${parameter} не должно быть пустым`
export const QUERY_PARAMETER_HAVE_MULTIPLE_VALUES = (parameter: string) => `В параметр ${parameter} нельзя передать несколько значений`
export const QUERY_PARAMETER_REGEXP_INCORRECT = (parameter: string, regExp: RegExp) =>
  `Значение параметра ${parameter} должно соответствовать регулярному выражению ${regExp}`
export const QUERY_PARAMETER_ENUM_INCORRECT = (parameter: string) => `Параметр ${parameter} должен соответствовать enum`
export const INVALID_DATE = 'Дата должна быть в формате yyyy-MM-ddThh:mm:ss.SSSZ'
export const INVALID_OS = 'Некорректная операционная система'
export const INVALID_APP_VERSION = 'Некорректный формат версии. Необходимый формат: d.d.d'
export const INCORRECT_INT = 'Некорректное значение целого числа'
export const INCORRECT_CREDENTIALS = 'Неправильные логин или пароль'

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
export const ADMIN_USER_WITH_LOGIN_NOT_FOUND = (login: string) => `Админ с логином ${login} не существует`

export const CALL_SCHEDULE_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Расписание звонков с id ${id} не существует`
export const CALL_SCHEDULE_WITH_NAME_EXISTS = (name: string) => `Расписание звонков с названием ${name} уже существует`
export const CALL_SCHEDULE_WITH_NAME_NOT_FOUND = (name: string) => `Расписание звонков с названием ${name} не существует`
export const DEFAULT_CALL_SCHEDULE_NOT_FOUND = `Дефолтное расписание звонков не существует`

export const APP_VERSION_FOR_OS_WITH_VERSION_EXISTS = (os: OperationSystem, version: string) => `Для ${os} версия ${version} уже существует`
export const APP_VERSION_FOR_OS_WITH_VERSION_NOT_FOUND = (os: OperationSystem, version: string) =>
  `Для ${os} версия ${version} не существует`

export const SEMESTER_RANGE_DATE_INCORRECT_RANGE = `Некорректный промежуток дат`
