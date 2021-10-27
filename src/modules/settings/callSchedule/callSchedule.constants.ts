import { FunctionalityDefault } from '../../functionality/functionality.constants'

export enum CallScheduleRoutesEnum {
  CREATE = '/',
  GET = '/',
}

export interface CallScheduleCreateDataForFunctionality {}
export const defaultCallScheduleCreateData: FunctionalityDefault<CallScheduleCreateDataForFunctionality> = {}

export interface CallScheduleGetDataForFunctionality {}
export const defaultCallScheduleGetData: FunctionalityDefault<CallScheduleGetDataForFunctionality> = {}
