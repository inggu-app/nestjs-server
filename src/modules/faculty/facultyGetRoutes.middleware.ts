import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'
import { FacultyGetQueryParametersEnum, FacultyRoutesEnum } from './faculty.constants'

@Injectable()
export class FacultyGetRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const query = parseRequestQueries(getEnumValues(FacultyGetQueryParametersEnum), req.url)

    const request = checkAlternativeQueryParameters<FacultyRoutesEnum>(
      { required: { facultyId: query.facultyId }, fields: query.fields, enum: FacultyRoutesEnum.GET_BY_FACULTY_ID },
      { required: { facultyIds: query.facultyIds }, fields: query.fields, enum: FacultyRoutesEnum.GET_BY_FACULTY_IDS },
      { required: { page: query.page, count: query.count }, title: query.title, fields: query.fields, enum: FacultyRoutesEnum.GET_MANY }
    )

    const [start, queryStr] = req.url.split('?')
    switch (request.enum) {
      case FacultyRoutesEnum.GET_BY_FACULTY_ID:
        req.url = `${start}${FacultyRoutesEnum.GET_BY_FACULTY_ID}?${queryStr}`
        break
      case FacultyRoutesEnum.GET_BY_FACULTY_IDS:
        req.url = `${start}${FacultyRoutesEnum.GET_BY_FACULTY_IDS}?${queryStr}`
        break
      case FacultyRoutesEnum.GET_MANY:
        req.url = `${start}${FacultyRoutesEnum.GET_MANY}?${queryStr}`
        break
    }

    next()
  }
}
