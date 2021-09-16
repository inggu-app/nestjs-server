import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'

export const RESPONSIBLE_EXISTS = 'Ответственный с таким логином уже существует'
export const RESPONSIBLE_NOT_FOUND = 'Ответственный с таким id не существует'

export enum GetResponsibleEnum {
  responsibleId,
  groupId,
  all,
}

export enum ResponsibleFieldsEnum {
  groups = 'groups',
  name = 'name',
  hashedUniqueKey = 'hashedUniqueKey',
  login = 'login',
  hashedPassword = 'hashedPassword',
}

export type ResponsibleField = keyof typeof ResponsibleFieldsEnum

enumKeyValuesMatch(ResponsibleFieldsEnum)
