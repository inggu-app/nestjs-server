import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'

export enum GetResponsibleEnum {
  responsibleId,
  groupId,
  all,
}

export enum ResponsibleFieldsEnum {
  groups = 'groups',
  faculties = 'faculties',
  forbiddenGroups = 'forbiddenGroups',
  name = 'name',
  hashedUniqueKey = 'hashedUniqueKey',
  login = 'login',
  hashedPassword = 'hashedPassword',
}

export const ResponsibleAdditionalFieldsEnum = {
  ...DefaultFieldsEnum,
}

export enum ResponsibleForbiddenFieldsEnum {
  hashedUniqueKey = 'hashedUniqueKey',
  hashedPassword = 'hashedPassword',
}

export type ResponsibleField = keyof typeof ResponsibleFieldsEnum

enumKeyValuesMatch(ResponsibleFieldsEnum)
enumKeyValuesMatch(ResponsibleForbiddenFieldsEnum)
