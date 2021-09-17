import { Types } from 'mongoose'
import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

export const ADMIN_EXISTS = (login: string) => `Админ с логином ${login} уже существует`
export const ADMIN_WITH_ID_NOT_FOUND = (id: Types.ObjectId) => `Админ с id ${id} не существует`
export const ADMIN_WITH_LOGIN_NOT_FOUND = (login: string) =>
  `Админ с логином ${login} не существует`

export enum GetAdminsEnum {
  adminId,
  all,
}

export enum AdminFieldsEnum {
  name = 'name',
  login = 'login',
  hashedUniqueKey = 'hashedUniqueKey',
  hashedPassword = 'hashedPassword',
}

export type AdminField = keyof typeof AdminFieldsEnum

enumKeyValuesMatch(AdminFieldsEnum)
