import { enumKeyValuesMatch } from '../utils/enumKeysValues'

export enum ItemTypeEnum {
  ALL = 'ALL',
  SPECIAL = 'SPECIAL',
}

enumKeyValuesMatch(ItemTypeEnum)
