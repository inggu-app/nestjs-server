import { NestMiddleware } from '@nestjs/common'
import { Request } from 'express'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { ViewGetQueryParametersEnum, ViewRoutesEnum } from './view.constants'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'

export class ViewGetRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    const query = parseRequestQueries(getEnumValues(ViewGetQueryParametersEnum), req.url)

    const request = checkAlternativeQueryParameters<ViewRoutesEnum>(
      {
        required: { code: query.code },
        fields: query.fields,
        enum: ViewRoutesEnum.GET_BY_CODE,
      },
      { required: { userId: query.userId }, fields: query.fields, enum: ViewRoutesEnum.GET_BY_USER_ID }
    )

    const [start = '', queryStr = ''] = req.url.split('?')
    switch (request.enum) {
      case ViewRoutesEnum.GET_BY_CODE:
        req.url = `${start}${ViewRoutesEnum.GET_BY_CODE}?${queryStr}`
        break
      case ViewRoutesEnum.GET_BY_USER_ID:
        req.url = `${start}${ViewRoutesEnum.GET_BY_USER_ID}?${queryStr}`
        break
    }

    next()
  }
}
