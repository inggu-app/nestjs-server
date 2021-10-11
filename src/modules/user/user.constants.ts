import enumKeyValuesMatch from '../../global/utils/enumKeyValuesMatch'
import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { MongoIdString } from '../../global/types'
import { UpdateUserDtoKeysEnum } from './dto/updateUser.dto'

export enum UserRoutesEnum {
  CREATE = '/',
  GET_BY_USER_ID = '/by-user-id',
  UPDATE = '/',
  DELETE = '/',
}

export enum UserGetQueryParametersEnum {
  USER_ID = 'userId',
  FIELDS = 'fields',
}

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
export type UserField = keyof typeof UserFieldsEnum

enumKeyValuesMatch(UserFieldsEnum)
enumKeyValuesMatch(UserForbiddenFieldsEnum)

export interface UserCreateDataForFunctionality {
  availableFunctionalitiesType: FunctionalityAvailableTypeEnum // доступность функциональностей, который пользователь может назначить
  availableFunctionalities: FunctionalityCodesEnum[] // список фукнциональностей, которые пользователь может назначить
  availableRolesType: FunctionalityAvailableTypeEnum // доступность ролей, которые пользователь может назначить
  availableRoles: MongoIdString[] // id ролей, которые пользователь может назначить
}

export interface UserGetByUserIdDataForFunctionality {
  availableUsersType: FunctionalityAvailableTypeEnum // доступность пользователей, которых можно получить
  availableUsers: MongoIdString[] // id пользователей, которых можно получить
}

export interface UserUpdateDataForFunctionality {
  availableUsersType: FunctionalityAvailableTypeEnum // доступность пользователей, которых можно обновить
  availableUsers: MongoIdString[] // id пользователей, которых можно обновить
  availableFields: (keyof typeof UpdateUserDtoKeysEnum)[] // поля пользователя, которые пользователь может редактировать
}

export interface UserDeleteDataForFunctionality {
  availableUsersType: FunctionalityAvailableTypeEnum // доступность пользователей, которых можно обновить
  availableUsers: MongoIdString[] // id пользователей, которых можно обновить
}
