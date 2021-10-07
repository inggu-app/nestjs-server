import enumKeyValuesMatch from '../utils/enumKeyValuesMatch'

export enum DefaultFieldsEnum {
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

enumKeyValuesMatch(DefaultFieldsEnum)
