import { GroupService } from './group.service'
import { checkOptionsForServiceMethodExistence } from '../../global/utils/serviceMethodOptions'

export const groupServiceMethodDefaultOptions = {
  create: {
    checkExistence: {
      group: true,
      faculty: true,
      callSchedule: true,
    },
  },
  getById: {
    checkExistence: {
      group: true,
    },
  },
  getByGroupIds: {
    checkExistence: {
      group: true,
    },
  },
  getByFacultyId: {
    checkExistence: {
      group: true,
    },
  },
  update: {
    checkExistence: {
      groupById: true,
      groupByTitleAndFaculty: true,
      faculty: true,
      callSchedule: true,
    },
  },
  updateLastScheduleUpdate: {
    checkExistence: {
      group: true,
    },
  },
  delete: {
    checkExistence: {
      group: true,
    },
  },
  deleteAllByFacultyId: {
    checkExistence: {
      group: true,
    },
  },
  countMany: {
    checkExistence: {},
  },
  getMany: {
    checkExistence: {},
  },
}

checkOptionsForServiceMethodExistence<GroupService>(groupServiceMethodDefaultOptions)
