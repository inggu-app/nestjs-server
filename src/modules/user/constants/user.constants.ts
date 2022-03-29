import { checkOptionsForServiceMethodExistence } from '../../../global/utils/serviceMethodOptions'
import { UserService } from '../services/user.service'

export const userServiceMethodDefaultOptions = {
  create: {
    checkExistence: {},
  },
  getById: {
    checkExistence: {
      user: true,
    },
  },
  getByLogin: {
    checkExistence: {
      user: true,
    },
  },
  getByIds: {
    checkExistence: {
      user: true,
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
      user: true,
    },
  },
  updateUserSuper: {
    checkExistence: {
      user: true,
    },
  },
  updateUserUltraSuper: {
    checkExistence: {
      user: true,
    },
  },
  updatePassword: {
    checkExistence: {
      user: true,
    },
  },
  updateAvailability: {
    checkExistence: {
      user: true,
    },
  },
  updateRoles: {
    checkExistence: {
      user: true,
      roles: true,
    },
  },
  addToken: {
    checkExistence: {
      user: true,
    },
  },
  deleteToken: {
    checkExistence: {
      user: true,
    },
  },
  checkTokenExists: {
    checkExistence: {
      user: true,
    },
  },
  deleteExpiredTokens: {
    checkExistence: {
      user: true,
    },
  },
  deleteById: {
    checkExistence: {
      user: true,
    },
  },
}

checkOptionsForServiceMethodExistence<UserService>(userServiceMethodDefaultOptions)
