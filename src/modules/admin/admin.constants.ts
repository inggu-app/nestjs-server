import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'

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
  ...DefaultFieldsEnum,
}

export enum AdminForbiddenFieldsEnum {
  hashedUniqueKey = 'hashedUniqueKey',
  hashedPassword = 'hashedPassword',
}

export type AdminField = keyof typeof AdminFieldsEnum

enumKeyValuesMatch(AdminFieldsEnum)
enumKeyValuesMatch(AdminForbiddenFieldsEnum)
