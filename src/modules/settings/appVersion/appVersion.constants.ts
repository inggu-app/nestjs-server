import { FunctionalityDefault } from '../../functionality/functionality.constants'

export enum AppVersionRoutesEnum {
  CREATE = '/',
  GET = '/get',
  CHECK = '/check',
  PATCH_FEATURES = '/',
  DELETE = '/',
}

export enum AppVersionGetQueryParameters {
  OS = 'os',
  VERSION = 'version',
}

export interface AppVersionCreateDataForFunctionality {}
export const defaultAppVersionCreateData: FunctionalityDefault<AppVersionCreateDataForFunctionality> = {}

export interface AppVersionPostFeaturesDataForFunctionality {}
export const defaultAppVersionPostFeaturesData: FunctionalityDefault<AppVersionPostFeaturesDataForFunctionality> = {}

export interface AppVersionGetDataForFunctionality {}
export const defaultAppVersionGetData: FunctionalityDefault<AppVersionGetDataForFunctionality> = {}

export interface AppVersionCheckDataForFunctionality {}
export const defaultAppVersionCheckData: FunctionalityDefault<AppVersionCheckDataForFunctionality> = {}

export interface AppVersionDeleteDataForFunctionality {}
export const defaultAppVersionDeleteData: FunctionalityDefault<AppVersionDeleteDataForFunctionality> = {}
