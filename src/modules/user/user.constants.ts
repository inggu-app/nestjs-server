import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { MongoIdString } from '../../global/types'
import { UpdateUserDtoKeysEnum } from './dto/updateUser.dto'
import { FunctionalityDefault } from '../functionality/functionality.constants'
import { TypesEnum } from '../../global/enums/types.enum'
import { DbModelsEnum } from '../../global/enums/dbModelsEnum'

export enum UserRoutesEnum {
  CREATE = '/',
  GET_BY_USER_ID = '/by-user-id',
  GET_BY_ROLE_ID = '/by-role-id',
  GET_MANY = '/many',
  UPDATE = '/',
  DELETE = '/',
  LOGIN = '/login',
}

export enum UserGetQueryParametersEnum {
  USER_ID = 'userId',
  ROLE_ID = 'roleId',
  PAGE = 'page',
  COUNT = 'count',
  NAME = 'name',
  ROLE_IDS = 'roleIds',
  FIELDS = 'fields',
}

export enum UserFieldsEnum {
  name = 'name',
  login = 'login',
  available = 'available',
  roles = 'roles',
  views = 'views',
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
export type UserField = keyof typeof UserFieldsEnum

enumKeyValuesMatch(UserFieldsEnum)
enumKeyValuesMatch(UserForbiddenFieldsEnum)

export interface UserCreateDataForFunctionality {}
export const defaultUserCreateData: FunctionalityDefault<UserCreateDataForFunctionality> = {}

export interface UserGetByUserIdDataForFunctionality {
  availableUsersType: FunctionalityAvailableTypeEnum // доступность пользователей, которых можно получить
  availableUsers: MongoIdString[] // id пользователей, которых можно получить
  forbiddenUsers: MongoIdString[] // id пользователей, которых нельзя получить
  availableRoles: MongoIdString[] // id ролей, пользователей с которыми можно получить
  forbiddenRoles: MongoIdString[] // id ролей, пользователей с которыми нельзя получить
}
export const defaultUserGetByUserIdData: FunctionalityDefault<UserGetByUserIdDataForFunctionality> = {
  availableUsersType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableUsers: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.USER_MODEL,
  },
  forbiddenUsers: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.USER_MODEL,
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

export interface UserGetByRoleIdDataForFunctionality {
  availableUsersType: FunctionalityAvailableTypeEnum.ALL // доступность пользователей, которых можно загрузить
  availableUsers: MongoIdString[] // id пользователей, которых можно получить
  forbiddenUsers: MongoIdString[] // id пользователей, которых нельзя получить
  availableRolesType: FunctionalityAvailableTypeEnum.ALL // доступность ролей, пользователей с которорыми можно получить
  availableRoles: MongoIdString[] // id ролей, пользователей с которыми можно получить
  forbiddenRoles: MongoIdString[] // id ролей, пользователей с которыми нельзя получить
}
export const defaultUserGetByRoleIdData: FunctionalityDefault<UserGetByRoleIdDataForFunctionality> = {
  availableUsersType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableUsers: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.USER_MODEL,
  },
  forbiddenUsers: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.USER_MODEL,
  },
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

export interface UserGetManyDataForFunctionality {
  availableUsersType: FunctionalityAvailableTypeEnum // доступность пользователей, которых можно загрузить
  availableUsers: MongoIdString[] // id пользователей, которых можно загрузить
  forbiddenUsers: MongoIdString[] // id пользователей, которых нельзя загрузить
  availableRolesType: FunctionalityAvailableTypeEnum // доступность ролей, пользователей с которыми можно загрузить
  availableRoles: MongoIdString[] // id ролей, пользователей с которыми можно загрузить
  forbiddenRoles: MongoIdString[] // id ролей, пользователей с которыми нельзя загрузить
}
export const defaultUserGetManyData: FunctionalityDefault<UserGetManyDataForFunctionality> = {
  availableUsersType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableUsers: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.USER_MODEL,
  },
  forbiddenUsers: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.USER_MODEL,
  },
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

export interface UserUpdateDataForFunctionality {
  availableUsersType: FunctionalityAvailableTypeEnum // доступность пользователей, которых можно обновить
  availableUsers: MongoIdString[] // id пользователей, которых можно обновить
  forbiddenUsers: MongoIdString[] // id пользователей, которых пользователь обновить НЕ может
  availableRolesType: FunctionalityAvailableTypeEnum // доступность ролей, пользователей с которыми можно обновить
  availableRoles: MongoIdString[] // id ролей, пользователей с которыми можно обновить
  forbiddenRoles: MongoIdString[] // id ролей, пользователей с которыми нельзя обновить
  availableFields: (keyof typeof UpdateUserDtoKeysEnum)[] // поля пользователя, которые пользователь может редактировать
  availableToSetFunctionalitiesType: FunctionalityAvailableTypeEnum // доступность фукнциональностей, который пользователь может назначить
  availableToSetFunctionalities: FunctionalityCodesEnum[] // фукнциональности, которые пользователь может назначить
  forbiddenToSetFunctionalities: FunctionalityCodesEnum[] // функциональности, которые пользователь назначить НЕ может
  availableToSetRolesType: FunctionalityAvailableTypeEnum // доступность ролей, которые пользователь может назначить
  availableToSetRoles: MongoIdString[] // id ролей, которые пользователь может назначить
  forbiddenToSetRoles: MongoIdString[] // id ролей, которые пользователь назначить НЕ может
  availableToSetInterfacesType: FunctionalityAvailableTypeEnum // доступность интерфейсов, которые может назначить пользователь
  availableToSetInterfaces: MongoIdString[] // id интерфейсов, которые пользователь может назначить
}
export const defaultUserUpdateData: FunctionalityDefault<UserUpdateDataForFunctionality> = {
  availableUsersType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableUsers: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.USER_MODEL,
  },
  forbiddenUsers: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.USER_MODEL,
  },
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
  availableFields: {
    type: TypesEnum.STRING_ARRAY,
    model: null,
  },
  availableToSetFunctionalitiesType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableToSetFunctionalities: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: null,
  },
  forbiddenToSetFunctionalities: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: null,
  },
  availableToSetRolesType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableToSetRoles: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.ROLE_MODEL,
  },
  forbiddenToSetRoles: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.ROLE_MODEL,
  },
  availableToSetInterfacesType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableToSetInterfaces: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.INTERFACE_MODEL,
  },
}

export interface UserDeleteDataForFunctionality {
  availableUsersType: FunctionalityAvailableTypeEnum // доступность пользователей, которых можно удалить
  availableUsers: MongoIdString[] // id пользователей, которых можно удалить
  forbiddenUsers: MongoIdString[] // id пользователей, который пользователь удалить НЕ может
  availableRoles: MongoIdString[] // id ролей, пользователей с которыми можно удалить
  forbiddenRoles: MongoIdString[] // id ролей, пользователей с которыми пользователь удалить не может
}
export const defaultUserDeleteData: FunctionalityDefault<UserDeleteDataForFunctionality> = {
  availableUsersType: {
    type: FunctionalityAvailableTypeEnum.ALL,
    model: null,
  },
  availableUsers: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.USER_MODEL,
  },
  forbiddenUsers: {
    type: TypesEnum.MONGO_ID_ARRAY,
    model: DbModelsEnum.USER_MODEL,
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
