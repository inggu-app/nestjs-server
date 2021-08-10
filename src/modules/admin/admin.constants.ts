import { Types } from 'mongoose'

export const ADMIN_EXISTS = (login: string) => `Админ с логином ${login} уже существует`
export const ADMIN_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Админ с id ${id} не существует`
export const ADMIN_WITH_LOGIN_NOT_FOUND = (login: string) =>
  `Админ с логином ${login} не существует`
