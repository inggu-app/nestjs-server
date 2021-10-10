import { NestMiddleware } from '@nestjs/common'
import { Request } from 'express'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'
import { FunctionalityRoutesEnum } from './functionality.constants'

export class FunctionalityRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    const request = checkAlternativeQueryParameters({ enum: FunctionalityRoutesEnum.GET_MANY })

    switch (request.enum) {
      case FunctionalityRoutesEnum.GET_MANY:
        req.url = FunctionalityRoutesEnum.GET_MANY + req.url
    }

    next()
  }
}
