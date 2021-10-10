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
      { required: { page: query.page, count: query.count }, fields: query.fields, enum: RoleRoutesEnum.GET_MANY }
    )

    switch (request.enum) {
      case RoleRoutesEnum.GET_BY_ROLE_ID:
        req.url = RoleRoutesEnum.GET_BY_ROLE_ID + req.url
        break
      case RoleRoutesEnum.GET_MANY:
        req.url = RoleRoutesEnum.GET_MANY + req.url
        break
    }

    next()
  }
}
