import { NestMiddleware } from '@nestjs/common'
import { Request } from 'express'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { UserGetQueryParametersEnum, UserRoutesEnum } from './user.constants'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'

export class UserGetRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    const query = parseRequestQueries(getEnumValues(UserGetQueryParametersEnum), req.url)

    const request = checkAlternativeQueryParameters<UserRoutesEnum>(
      { required: { userId: query.userId }, fields: query.fields, enum: UserRoutesEnum.GET_BY_USER_ID },
      { required: { userId: query.userId, roleId: query.roleId }, fields: query.fields, enum: UserRoutesEnum.GET_BY_ROLE_ID }
    )

    const [start = '', queryStr = ''] = req.url.split('?')
    switch (request.enum) {
      case UserRoutesEnum.GET_BY_USER_ID:
        req.url = `${start}${UserRoutesEnum.GET_BY_USER_ID}?${queryStr}`
        break
      case UserRoutesEnum.GET_BY_ROLE_ID:
        req.url = `${start}${UserRoutesEnum.GET_BY_ROLE_ID}?${queryStr}`
        break
    }
    next()
  }
}
