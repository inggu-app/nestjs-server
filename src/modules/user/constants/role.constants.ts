import { checkOptionsForServiceMethodExistence } from '../../../global/utils/serviceMethodOptions'
import { RoleService } from '../services/role.service'

export const roleServiceMethodDefaultOptions = {
  create: {
    checkExistence: {},
  },
  getMany: {
    checkExistence: {},
  },
  countMany: {
    checkExistence: {},
  },
}

checkOptionsForServiceMethodExistence<RoleService>(roleServiceMethodDefaultOptions)
