import { FunctionalityDefault } from '../../functionality/functionality.constants'

export enum WeeksCountRoutesEnum {
  CREATE = '/',
  GET = '/',
}

export interface WeeksCountCreateDataForFunctionality {}
export const defaultWeeksCountCreateData: FunctionalityDefault<WeeksCountCreateDataForFunctionality> = {}

export interface WeeksCountGetDataForFunctionality {}
export const defaultWeeksCountGetData: FunctionalityDefault<WeeksCountGetDataForFunctionality> = {}
