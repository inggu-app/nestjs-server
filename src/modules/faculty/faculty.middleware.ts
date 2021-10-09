import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'
import { FacultyGetQueryParametersEnum, FacultyRoutesEnum, GetFacultiesEnum } from './faculty.constants'

@Injectable()
export class FacultyRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const query = parseRequestQueries(getEnumValues(FacultyGetQueryParametersEnum), req.url)

    const request = checkAlternativeQueryParameters<GetFacultiesEnum>(
      { required: { facultyId: query.facultyId }, fields: query.fields, enum: GetFacultiesEnum.facultyId },
      { required: { page: query.page, count: query.count }, title: query.title, fields: query.fields, enum: GetFacultiesEnum.many }
    )

    switch (request.enum) {
      case GetFacultiesEnum.facultyId:
        req.url = FacultyRoutesEnum.GET_BY_FACULTY_ID + req.url
        break
      case GetFacultiesEnum.many:
        req.url = FacultyRoutesEnum.GET_MANY + req.url
        break
    }
    next()
  }
}
