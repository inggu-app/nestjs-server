import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'

export enum RoleFieldsEnum {
  title = 'title',
  functionalities = 'functionalities',
}

export const UserAdditionalFieldsEnum = {
  ...DefaultFieldsEnum,
}

enumKeyValuesMatch(RoleFieldsEnum)
enumKeyValuesMatch(UserAdditionalFieldsEnum)

export type RoleField = keyof typeof RoleFieldsEnum
