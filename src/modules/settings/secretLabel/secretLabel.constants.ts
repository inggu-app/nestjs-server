import { FunctionalityDefault } from '../../functionality/functionality.constants'

export enum SecretLabelRoutesEnum {
  CREATE = '/',
  GET = '/',
}

export interface SecretLabelCreateDataForFunctionality {}
export const defaultSecretLabelCreateData: FunctionalityDefault<SecretLabelCreateDataForFunctionality> = {}

export interface SecretLabelGetDataForFunctionality {}
export const defaultSecretLabelGetData: FunctionalityDefault<SecretLabelGetDataForFunctionality> = {}
