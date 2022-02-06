import { checkOptionsForServiceMethodExistence } from '../../global/utils/serviceMethodOptions'
import { CallScheduleService } from './callSchedule.service'

export const callScheduleServiceMethodDefaultOptions = {
  create: {
    checkExistence: {
      callSchedule: true,
    },
  },
  getById: {
    checkExistence: {
      callSchedule: true,
    },
  },
  getByName: {
    checkExistence: {
      callSchedule: true,
    },
  },
  getDefaultSchedule: {
    checkExistence: {
      callSchedule: true,
    },
  },
  update: {
    checkExistence: {
      callSchedule: true,
    },
  },
  updateDefaultSchedule: {
    checkExistence: {
      callSchedule: true,
    },
  },
  deleteById: {
    checkExistence: {
      callSchedule: true,
    },
  },
  deleteByName: {
    checkExistence: {
      callSchedule: true,
    },
  },
}

checkOptionsForServiceMethodExistence<CallScheduleService>(callScheduleServiceMethodDefaultOptions)
