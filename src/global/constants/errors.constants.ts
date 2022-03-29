import { Types } from 'mongoose'
import { DeviceId } from '../types'
import { OperationSystem } from '../enums/OS.enum'

export const INVALID_MONGO_ID = (id: string) => `Некорретный id ${id}`
export const QUERY_PARAMETER_IS_REQUIRED = (parameter: string) => `Параметр ${parameter} обязателен`
export const QUERY_PARAMETER_IS_EMPTY = (parameter: string) => `Значение параметра ${parameter} не должно быть пустым`
export const QUERY_PARAMETER_HAVE_MULTIPLE_VALUES = (parameter: string) => `В параметр ${parameter} нельзя передать несколько значений`
export const QUERY_PARAMETER_REGEXP_INCORRECT = (parameter: string, regExp: RegExp) =>
  `Значение параметра ${parameter} должно соответствовать регулярному выражению ${regExp}`
export const QUERY_PARAMETER_ENUM_INCORRECT = (parameter: string) => `Значение параметра ${parameter} должно соответствовать enum`
export const QUERY_PARAMETER_INT_INCORRECT = (parameter: string) => `Значение параметра ${parameter} должно быть целым числом`
export const QUERY_PARAMETER_POSITIVE_INT_INCORRECT = (parameter: string) =>
  `Значение параметра ${parameter} должно быть положительным целым числом`
export const QUERY_PARAMETER_NEGATIVE_INT_INCORRECT = (parameter: string) =>
  `Значение параметра ${parameter} должно быть отрицательным целым числом`
export const QUERY_PARAMETER_DATE_INCORRECT = (parameter: string, regExp: RegExp) =>
  `Значение параметра ${parameter} должно быть датой и должно соответствовать регулярному выражению ${regExp}`
export const INCORRECT_CREDENTIALS = 'Неправильные логин или пароль'
export const FORBIDDEN_CLIENT_INTERFACE = 'Доступ через это клиентское приложение запрещён'
export const NOT_AUTHORIZED = 'Вы не авторизованы'

export const FACULTY_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Факультета с id "${id}" не существует`
export const FACULTY_WITH_TITLE_EXISTS = (title: string) => `Факультет с названием "${title}" уже существует`

export const GROUP_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Группа с id "${id}" не существует`
export const GROUP_WITH_TITLE_EXISTS = (title: string) => `Группа с названием "${title}" уже существует`

export const LESSON_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Занятие с id ${id} не существует`

export const NOTE_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Заметки с id "${id}" не существует`
export const INVALID_NOTE_DEVICE_ID = (id: Types.ObjectId, deviceId: DeviceId) =>
  `Заметка c id ${id} создана не устройством с deviceId ${deviceId}`

export const USER_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Пользователь с id ${id} не существует`
export const USER_WITH_LOGIN_EXISTS = (login: string) => `Пользователь с логином ${login} уже существует`
export const USER_WITH_LOGIN_NOT_FOUND = (login: string) => `Пользователь с логином ${login} не существует`
export const ROLE_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Роль с id ${id} не существует`
export const ROLE_WITH_LABEL_EXISTS = (label: string) => `Роль с названием ${label} уже существует`

export const CALL_SCHEDULE_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Расписание звонков с id ${id} не существует`
export const CALL_SCHEDULE_WITH_NAME_EXISTS = (name: string) => `Расписание звонков с названием ${name} уже существует`
export const CALL_SCHEDULE_WITH_NAME_NOT_FOUND = (name: string) => `Расписание звонков с названием ${name} не существует`
export const DEFAULT_CALL_SCHEDULE_NOT_FOUND = `Дефолтное расписание звонков не существует`

export const APP_VERSION_FOR_OS_WITH_VERSION_EXISTS = (os: OperationSystem, version: string) => `Для ${os} версия ${version} уже существует`
export const APP_VERSION_FOR_OS_WITH_VERSION_NOT_FOUND = (os: OperationSystem, version: string) =>
  `Для ${os} версия ${version} не существует`

export const LEARNING_STAGE_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Стадия с id ${id} не существует`
export const LEARNING_STAGE_INTERVALS_COLLISION = 'Создаваемый интервал пересекается с уже сущестующими'
export const LEARNING_STAGE_BY_DATE_NOT_FOUND = (date: Date) => `На момент ${date.toISOString()} не идёт никакая стадия обучения`

export const SEMESTER_RANGE_DATE_INCORRECT_RANGE = `Некорректный промежуток дат`
