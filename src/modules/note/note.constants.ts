import { checkOptionsForServiceMethodExistence } from '../../global/utils/serviceMethodOptions'
import { NoteService } from './note.service'

export const noteServiceMethodDefaultOptions = {
  create: {
    checkExistence: {
      note: true,
    },
  },
  get: {
    checkExistence: {
      note: true,
    },
  },
  getById: {
    checkExistence: {
      note: true,
    },
  },
  delete: {
    checkExistence: {
      note: true,
    },
  },
  deleteAllByLessonIds: {
    checkExistence: {
      note: true,
    },
  },
  deleteByLessonId: {
    checkExistence: {
      note: true,
    },
  },
}

checkOptionsForServiceMethodExistence<NoteService>(noteServiceMethodDefaultOptions)
