import { enumKeyValuesMatch } from '../utils/enumKeysValues'

export enum OperationSystem {
  ANDROID = 'ANDROID',
  IOS = 'IOS',
}

enumKeyValuesMatch(OperationSystem)
