import { checkOptionsForServiceMethodExistence } from '../../global/utils/serviceMethodOptions'
import { FacultyService } from './faculty.service'

export const facultyServiceMethodDefaultOptions = {
  create: {
    checkExistence: {
      faculty: true,
    },
  },
  getById: {
    checkExistence: {
      faculty: true,
    },
  },
  getByIds: {
    checkExistence: {
      faculty: true,
    },
  },
  getAll: {
    checkExistence: {},
  },
  countAll: {
    checkExistence: {},
  },
  update: {
    checkExistence: {
      faculty: true,
    },
  },
  delete: {
    checkExistence: {
      faculty: true,
    },
  },
  clearFrom: {
    checkExistence: {},
  },
}

checkOptionsForServiceMethodExistence<FacultyService>(facultyServiceMethodDefaultOptions)
