import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { MongoIdString } from '../../global/types'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'

export enum RoleRoutesEnum {
  CREATE = '/',
  GET_BY_ROLE_ID = '/by-role-id',
  GET_MANY = '/many',
  UPDATE = '/',
  DELETE = '/',
}

export enum RoleGetQueryParametersEnum {
  ROLE_ID = 'roleId',
  PAGE = 'page',
  COUNT = 'count',
  FIELDS = 'fields',
}

export enum RoleFieldsEnum {
  title = 'title',
  available = 'available',
  roleFields = 'roleFields',
}

export const RoleAdditionalFieldsEnum = {
  ...DefaultFieldsEnum,
}

enumKeyValuesMatch(RoleFieldsEnum)
enumKeyValuesMatch(RoleAdditionalFieldsEnum)

export type RoleField = keyof typeof RoleFieldsEnum

export interface RoleCreateDataForFunctionality {}

export interface RoleGetByRoleIdDataForFunctionality {
  availableRolesType: FunctionalityAvailableTypeEnum // доступность загрузки списка ролей для пользователя
  availableRoles: MongoIdString[] // id ролей, которые пользователь может загрузить
}

export interface RoleGetManyDataForFunctionality {
  availableRolesType: FunctionalityAvailableTypeEnum // доступность загрузки списка ролей для пользователя
  availableRoles: MongoIdString[] // id ролей, которые пользователь может загрузить
}

export interface RoleUpdateDataForFunctionality {
  availableFunctionalitiesType: FunctionalityAvailableTypeEnum // доступность функциональностей, которые может добавить пользователь
  availableFunctionalities: FunctionalityCodesEnum[] // коды фукнциональностей, которые пользователь может изменить
}

export interface RoleDeleteDataForFunctionality {
  availableRolesType: FunctionalityAvailableTypeEnum // доступность ролей, которые может удалить пользователь
  availableRoles: MongoIdString[] // id ролей, которые пользователь может удалить
}
