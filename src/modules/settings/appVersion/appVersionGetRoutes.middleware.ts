import { NestMiddleware } from '@nestjs/common'
import checkAlternativeQueryParameters from '../../../global/utils/alternativeQueryParameters'
import { AppVersionGetQueryParameters, AppVersionRoutesEnum } from './appVersion.constants'
import { parseRequestQueries } from '../../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../../global/utils/enumKeysValues'
import { Request, Response } from 'express'

export class AppVersionGetRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const query = parseRequestQueries(getEnumValues(AppVersionGetQueryParameters), req.url)
    const request = checkAlternativeQueryParameters<AppVersionRoutesEnum>(
      { required: { os: query.os, version: query.version }, enum: AppVersionRoutesEnum.CHECK },
      { required: { os: query.os }, enum: AppVersionRoutesEnum.GET }
    )

    const [start, queryStr] = req.url.split('?')
    switch (request.enum) {
      case AppVersionRoutesEnum.CHECK:
        req.url = `${start}${AppVersionRoutesEnum.CHECK}?${queryStr}`
        break
      case AppVersionRoutesEnum.GET:
        req.url = `${start}${AppVersionRoutesEnum.GET}?${queryStr}`
        break
    }

    next()
  }
}
