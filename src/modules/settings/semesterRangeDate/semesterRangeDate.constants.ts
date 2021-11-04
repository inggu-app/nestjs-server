import { FunctionalityDefault } from '../../functionality/functionality.constants'

export enum SemesterRangeDateRoutesEnum {
  CREATE = '/',
  GET = '/',
}

export interface SemesterRangeDateCreateDataForFunctionality {}
export const defaultSemesterRangeDateCreateData: FunctionalityDefault<SemesterRangeDateCreateDataForFunctionality> = {}

export interface SemesterRangeDateGetDataForFunctionality {}
export const defaultSemesterRangeDateGetData: FunctionalityDefault<SemesterRangeDateGetDataForFunctionality> = {}
