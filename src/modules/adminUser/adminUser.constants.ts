import { checkOptionsForServiceMethodExistence } from '../../global/utils/serviceMethodOptions'
import { AdminUserService } from './adminUser.service'

export const adminUserServiceMethodDefaultOptions = {
  create: {
    checkExistence: {
      adminUser: true,
    },
  },
  getById: {
    checkExistence: {
      adminUser: true,
    },
  },
  getByLogin: {
    checkExistence: {
      adminUser: true,
    },
  },
  getByIds: {
    checkExistence: {
      adminUser: true,
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
      adminUser: true,
    },
  },
  updatePassword: {
    checkExistence: {
      adminUser: true,
    },
  },
  updateAvailability: {
    checkExistence: {
      adminUser: true,
    },
  },
  addToken: {
    checkExistence: {
      adminUser: true,
    },
  },
  deleteToken: {
    checkExistence: {
      adminUser: true,
    },
  },
  checkTokenExists: {
    checkExistence: {
      adminUser: true,
    },
  },
  deleteExpiredTokens: {
    checkExistence: {
      adminUser: true,
    },
  },
  deleteById: {
    checkExistence: {
      adminUser: true,
    },
  },
}

checkOptionsForServiceMethodExistence<AdminUserService>(adminUserServiceMethodDefaultOptions)
