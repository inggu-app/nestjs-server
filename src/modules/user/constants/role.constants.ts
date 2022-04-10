import { checkOptionsForServiceMethodExistence } from '../../../global/utils/serviceMethodOptions'
import { RoleService } from '../services/role.service'

export const roleServiceMethodDefaultOptions = {
  create: {
    checkExistence: {},
  },
  getById: {
    checkExistence: {
      role: true,
    },
  },
  getByIds: {
    checkExistence: {
      role: true,
    },
  },
  getMany: {
    checkExistence: {},
  },
  countMany: {
    checkExistence: {},
  },
  update: {
    checkExistence: {
      role: true,
    },
  },
  deleteById: {
    checkExistence: {
      role: true,
    },
  },
}

checkOptionsForServiceMethodExistence<RoleService>(roleServiceMethodDefaultOptions)
