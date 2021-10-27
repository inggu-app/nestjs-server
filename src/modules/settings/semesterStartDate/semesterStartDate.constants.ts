import { FunctionalityDefault } from '../../functionality/functionality.constants'

export enum SemesterStartDateRoutesEnum {
  CREATE = '/',
  GET = '/',
}

export interface SemesterStartDateCreateDataForFunctionality {}
export const defaultSemesterStartDateCreateData: FunctionalityDefault<SemesterStartDateCreateDataForFunctionality> = {}

export interface SemesterStartDateGetDataForFunctionality {}
export const defaultSemesterStartDateGetData: FunctionalityDefault<SemesterStartDateGetDataForFunctionality> = {}
