import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFields } from '../../global/enums/defaultFields'

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

export const AdminAdditionalFieldsEnum = {
  ...DefaultFields,
}

export enum AdminForbiddenFieldsEnum {
  hashedUniqueKey = 'hashedUniqueKey',
  hashedPassword = 'hashedPassword',
}

export type AdminField = keyof typeof AdminFieldsEnum

enumKeyValuesMatch(AdminFieldsEnum)
enumKeyValuesMatch(AdminForbiddenFieldsEnum)
