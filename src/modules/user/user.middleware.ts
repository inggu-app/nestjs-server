import { NestMiddleware } from '@nestjs/common'
import { Request } from 'express'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { UserGetQueryParametersEnum, UserRoutesEnum } from './user.constants'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'

export class UserRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    const query = parseRequestQueries(getEnumValues(UserGetQueryParametersEnum), req.url)

    const request = checkAlternativeQueryParameters<UserRoutesEnum>({
      required: { userId: query.userId },
      fields: query.fields,
      enum: UserRoutesEnum.GET_BY_USER_ID,
    })

    switch (request.enum) {
      case UserRoutesEnum.GET_BY_USER_ID:
        req.url = UserRoutesEnum.GET_BY_USER_ID + req.url
        break
    }
    next()
  }
}
