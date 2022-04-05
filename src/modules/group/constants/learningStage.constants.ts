import { checkOptionsForServiceMethodExistence } from '../../../global/utils/serviceMethodOptions'
import { LearningStageService } from '../services/learningStage.service'
import { enumKeyValuesMatch } from '../../../global/utils/enumKeysValues'

export enum LearningStage {
  LEARNING = 'LEARNING',
  SESSION = 'SESSION',
  HOLIDAYS = 'HOLIDAYS',
  OTHER = 'OTHER',
}
enumKeyValuesMatch(LearningStage)

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
