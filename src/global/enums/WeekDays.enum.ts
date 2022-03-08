import { enumKeyValuesMatch } from '../utils/enumKeysValues'

export enum WeekDaysEnum {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

enumKeyValuesMatch(WeekDaysEnum)
