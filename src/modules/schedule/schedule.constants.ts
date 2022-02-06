import { checkOptionsForServiceMethodExistence } from '../../global/utils/serviceMethodOptions'
import { ScheduleService } from './schedule.service'

export enum WeeksTypeEnum {
  WEEKS,
  FIRST,
  SECOND,
  ALL,
}

export const scheduleServiceMethodDefaultOptions = {
  create: {
    checkExistence: {},
  },
  getByGroupId: {
    checkExistence: {
      group: true,
    },
  },
  getByGroupIds: {
    checkExistence: {
      group: true,
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
      group: true,
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
