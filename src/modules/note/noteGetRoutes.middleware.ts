import { NestMiddleware } from '@nestjs/common'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { GetNotesEnum, NoteGetQueryParametersEnum, NoteRoutesEnum } from './note.constants'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { Request } from 'express'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'

export class NoteGetRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    const query = parseRequestQueries(getEnumValues(NoteGetQueryParametersEnum), req.url)

    const request = checkAlternativeQueryParameters<GetNotesEnum>(
      { required: { noteId: query.noteId }, fields: query.fields, enum: GetNotesEnum.BY_NOTE_ID },
      { required: { lessonId: query.lessonId, week: query.week }, fields: query.fields, enum: GetNotesEnum.BY_LESSON_ID }
    )

    switch (request.enum) {
      case GetNotesEnum.BY_NOTE_ID:
        req.url = NoteRoutesEnum.GET_BY_NOTE_ID + req.url
        break
      case GetNotesEnum.BY_LESSON_ID:
        req.url = NoteRoutesEnum.GET_BY_LESSON_ID + req.url
        break
    }

    next()
  }
}
