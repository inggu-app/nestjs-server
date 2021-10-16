import { DefaultFieldsEnum } from '../../global/enums/defaultFields.enum'
import { FunctionalityDefault } from '../functionality/functionality.constants'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { MongoIdString } from '../../global/types'
import { TypesEnum } from '../../global/enums/types.enum'

export enum ViewRoutesEnum {
  CREATE = '/',
  GET_BY_CODE = '/by-code',
  GET_BY_USER_ID = '/by-user-id',
  UPDATE = '/',
  DELETE = '/',
}

export enum ViewGetQueryParametersEnum {
  CODE = 'code',
  FIELDS = 'fields',
  USER_ID = 'userId',
  INTERFACE = 'interface',
}

export enum ViewFieldsEnum {
  code = 'code',
  description = 'description',
  interface = 'interface',
}

export const ViewAdditionalFieldsEnum = {
  ...DefaultFieldsEnum,
}

export type ViewField = keyof typeof ViewFieldsEnum

export interface ViewCreateDataForFunctionality {}
export const defaultViewCreateData: FunctionalityDefault<ViewCreateDataForFunctionality> = {}

export interface ViewGetByCodeForFunctionality {}
export const defaultViewGetByCodeData: FunctionalityDefault<ViewGetByCodeForFunctionality> = {}

export interface ViewGetByUserIdDataForFunctionality {
  availableUsersType: FunctionalityAvailableTypeEnum // доступность пользователей, для которых можно загрузить отображения
  availableUsers: MongoIdString[] // id пользователей, для которых можно загрузить отображения
  forbiddenUsers: MongoIdString[] // id пользователей, для которых можно загрузить отображения
}
export const defaultViewGetByUserIdData: FunctionalityDefault<ViewGetByUserIdDataForFunctionality> = {
  availableUsersType: FunctionalityAvailableTypeEnum.ALL,
  availableUsers: TypesEnum.MONGO_ID_ARRAY,
  forbiddenUsers: TypesEnum.MONGO_ID_ARRAY,
}

export interface ViewUpdateDataForFunctionality {}
export const defaultViewUpdateData: FunctionalityDefault<ViewUpdateDataForFunctionality> = {}

export interface ViewDeleteDataForFunctionality {}
export const defaultViewDeleteData: FunctionalityDefault<ViewDeleteDataForFunctionality> = {}
