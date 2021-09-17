import enumKeyValuesMatch from '../utils/enumKeyValuesMatch'

export enum DefaultFields {
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

enumKeyValuesMatch(DefaultFields)
