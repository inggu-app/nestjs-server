import { checkOptionsForServiceMethodExistence } from '../../../global/utils/serviceMethodOptions'
import { LearningStageService } from '../services/learningStage.service'

export const learningStageMethodDefaultOptions = {
  updateByFacultyId: {
    checkExistence: {
      faculty: true,
    },
  },
  updateForAllGroups: {
    checkExistence: {},
  },
}

checkOptionsForServiceMethodExistence<LearningStageService>(learningStageMethodDefaultOptions)
