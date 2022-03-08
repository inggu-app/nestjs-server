import { checkOptionsForServiceMethodExistence } from '../../global/utils/serviceMethodOptions'
import { ScheduleService } from './schedule.service'
import { enumKeyValuesMatch } from '../../global/utils/enumKeysValues'

export enum WeeksTypeEnum {
  WEEKS = 'WEEKS',
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  ALL = 'ALL',
}

enumKeyValuesMatch(WeeksTypeEnum)

export const scheduleServiceMethodDefaultOptions = {
  create: {
    checkExistence: {
      group: true,
    },
  },
  getByGroupId: {
    checkExistence: {
      group: true,
    },
  },
  getByGroupIds: {
    checkExistence: {
      groups: true,
    },
  },
  getById: {
    checkExistence: {
      schedule: true,
    },
  },
  updateById: {
    checkExistence: {
      schedule: true,
    },
  },
  deleteByGroupId: {
    checkExistence: {
      group: true,
    },
  },
  deleteAllByGroupIds: {
    checkExistence: {
      groups: true,
    },
  },
  deleteById: {
    checkExistence: {
      schedule: true,
    },
  },
  deleteMany: {
    checkExistence: {
      schedule: true,
    },
  },
}

checkOptionsForServiceMethodExistence<ScheduleService>(scheduleServiceMethodDefaultOptions)
