import { checkOptionsForServiceMethodExistence } from '../../../global/utils/serviceMethodOptions'
import { CallScheduleService } from '../services/callSchedule.service'

export const callScheduleMethodDefaultOptions = {
  updateByFacultyId: {
    checkExistence: {
      faculty: true,
    },
  },
  updateForAllGroups: {
    checkExistence: {},
  },
}

checkOptionsForServiceMethodExistence<CallScheduleService>(callScheduleMethodDefaultOptions)
