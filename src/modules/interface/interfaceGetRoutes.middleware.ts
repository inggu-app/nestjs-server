import { NestMiddleware } from '@nestjs/common'
import { Request } from 'express'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { InterfaceGetQueryParametersEnum, InterfaceRoutesEnum } from './interface.constants'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'

export class InterfaceGetRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    const query = parseRequestQueries(getEnumValues(InterfaceGetQueryParametersEnum), req.url)

    const request = checkAlternativeQueryParameters({
      required: { code: query.code },
      fields: query.fields,
      enum: InterfaceRoutesEnum.GET_BY_CODE,
    })

    const [start, queryStr] = req.url.split('?')
    switch (request.enum) {
      case InterfaceRoutesEnum.GET_BY_CODE:
        req.url = `${start}${InterfaceRoutesEnum.GET_BY_CODE}?${queryStr}`
    }

    next()
  }
}
