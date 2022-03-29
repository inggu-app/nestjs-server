import { enumKeyValuesMatch } from '../../global/utils/enumKeysValues'

export enum LearningStage {
  LEARNING = 'LEARNING',
  SESSION = 'SESSION',
  HOLIDAYS = 'HOLIDAYS',
  OTHER = 'OTHER',
}

enumKeyValuesMatch(LearningStage)
