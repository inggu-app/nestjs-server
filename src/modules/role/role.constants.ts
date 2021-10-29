import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { MongoIdString } from '../../global/types'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { FunctionalityDefault } from '../functionality/functionality.constants'
import { TypesEnum } from '../../global/enums/types.enum'
import { UpdateRoleDtoKeysEnum } from './dto/updateRole.dto'
import { DbModelsEnum } from '../../global/enums/dbModelsEnum'

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
  code = 'code',
  views = 'views',
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
export const defaultRoleCreateData: FunctionalityDefault<RoleCreateDataForFunctionality> = {}

export interface RoleGetByRoleIdDataForFunctionality {
  availableRolesType: FunctionalityAvailableTypeEnum // доступность загрузки списка ролей для пользователя
  availableRoles: MongoIdString[] // id ролей, которые пользователь может загрузить
}
export const defaultRoleGetByRoleIdData: FunctionalityDefault<RoleGetByRoleIdDataForFunctionality> = {
  availableRolesType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableRoles: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.ROLE_MODEL,
  },
}

export interface RoleGetManyDataForFunctionality {
  availableRolesType: FunctionalityAvailableTypeEnum // доступность загрузки списка ролей для пользователя
  availableRoles: MongoIdString[] // id ролей, которые пользователь может загрузить
  forbiddenRoles: MongoIdString[] // id ролей, которые пользователь НЕ может загрузить
}
export const defaultRoleGetManyData: FunctionalityDefault<RoleGetManyDataForFunctionality> = {
  availableRolesType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableRoles: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.ROLE_MODEL,
  },
  forbiddenRoles: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.ROLE_MODEL,
  },
}

export interface RoleUpdateDataForFunctionality {
  availableRolesType: FunctionalityAvailableTypeEnum // доступность ролей, которые пользователь может изменить
  availableRoles: MongoIdString[] // id ролей, которые пользователь может изменить
  availableFields: (keyof typeof UpdateRoleDtoKeysEnum)[]
  availableFunctionalitiesType: FunctionalityAvailableTypeEnum // доступность функциональностей, которые может добавить пользователь
  availableFunctionalities: FunctionalityCodesEnum[] // коды фукнциональностей, которые пользователь может изменить
}
export const defaultRoleUpdateData: FunctionalityDefault<RoleUpdateDataForFunctionality> = {
  availableRolesType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableRoles: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.ROLE_MODEL,
  },
  availableFields: {
    type: TypesEnum.STRING_ARRAY,
    model: null,
  },
  availableFunctionalitiesType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableFunctionalities: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: null,
  },
}

export interface RoleDeleteDataForFunctionality {
  availableRolesType: FunctionalityAvailableTypeEnum // доступность ролей, которые может удалить пользователь
  availableRoles: MongoIdString[] // id ролей, которые пользователь может удалить
}
export const defaultRoleDeleteData: FunctionalityDefault<RoleDeleteDataForFunctionality> = {
  availableRolesType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableRoles: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.ROLE_MODEL,
  },
}
