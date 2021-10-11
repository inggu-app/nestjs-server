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

export interface UserCreateDataForFunctionality {}

export interface UserGetByUserIdDataForFunctionality {
  availableUsersType: FunctionalityAvailableTypeEnum // доступность пользователей, которых можно получить
  availableUsers: MongoIdString[] // id пользователей, которых можно получить
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
  forbiddenToSetRoles: MongoIdString[] // id ролей, которые пользоаватель назначить НЕ может
}

export interface UserDeleteDataForFunctionality {
  availableUsersType: FunctionalityAvailableTypeEnum // доступность пользователей, которых можно обновить
  availableUsers: MongoIdString[] // id пользователей, которых можно обновить
}
