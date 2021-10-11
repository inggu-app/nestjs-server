import { NestMiddleware } from '@nestjs/common'
import { Request } from 'express'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { RoleGetQueryParametersEnum, RoleRoutesEnum } from './role.constants'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'

export class RoleRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    const query = parseRequestQueries(getEnumValues(RoleGetQueryParametersEnum), req.url)

    const request = checkAlternativeQueryParameters<RoleRoutesEnum>(
      { required: { roleId: query.roleId }, fields: query.fields, enum: RoleRoutesEnum.GET_BY_ROLE_ID },
      { fields: query.fields, enum: RoleRoutesEnum.GET_MANY }
    )

    const [start = '', queryStr = ''] = req.url.split('?')
    switch (request.enum) {
      case RoleRoutesEnum.GET_BY_ROLE_ID:
        req.url = `${start}${RoleRoutesEnum.GET_BY_ROLE_ID}?${queryStr}`
        break
      case RoleRoutesEnum.GET_MANY:
        req.url = `${start}${RoleRoutesEnum.GET_MANY}?${queryStr}`
        break
    }

    next()
  }
}
