import { GroupService } from '../services/group.service'
import { checkOptionsForServiceMethodExistence } from '../../../global/utils/serviceMethodOptions'

export const groupServiceMethodDefaultOptions = {
  create: {
    checkExistence: {
      group: true,
      faculty: true,
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
      faculty: true,
    },
  },
  update: {
    checkExistence: {
      groupById: true,
      groupByTitleAndFaculty: true,
      faculty: true,
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
      faculty: true,
    },
  },
  countMany: {
    checkExistence: {},
  },
  getMany: {
    checkExistence: {},
  },
  clearFrom: {
    checkExistence: {},
  },
}

checkOptionsForServiceMethodExistence<GroupService>(groupServiceMethodDefaultOptions)
