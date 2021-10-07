import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'
import { AdminFieldsEnum } from '../admin/admin.constants'

export enum UserFieldsEnum {
  name = 'name',
  login = 'login',
  available = 'available',
  roles = 'roles',
  hashedPassword = 'hashedPassword',
  hashedUniqueKey = 'hashedUniqueKey',
}

export const UserAdditionalFieldsEnum = {
  ...DefaultFieldsEnum,
}

export enum UserForbiddenFieldsEnum {
  hashedUniqueKey = 'hashedUniqueKey',
  hashedPassword = 'hashedPassword',
}
export type AdminField = keyof typeof AdminFieldsEnum

enumKeyValuesMatch(UserFieldsEnum)
enumKeyValuesMatch(UserForbiddenFieldsEnum)
