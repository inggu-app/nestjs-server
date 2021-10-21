import { NestMiddleware } from '@nestjs/common'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { ScheduleGetQueryParametersEnum, ScheduleRoutesEnum } from './schedule.constants'
import { Request } from 'express'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'

export class ScheduleGetRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    const query = parseRequestQueries(getEnumValues(ScheduleGetQueryParametersEnum), req.url)

    const request = checkAlternativeQueryParameters<ScheduleRoutesEnum>({
      required: { groupId: query.groupId },
      fields: query.fields,
      updatedAt: query.updatedAt,
      enum: ScheduleRoutesEnum.GET_BY_GROUP_ID,
    })

    const [start, queryStr] = req.url.split('?')
    switch (request.enum) {
      case ScheduleRoutesEnum.GET_BY_GROUP_ID:
        req.url = `${start}${ScheduleRoutesEnum.GET_BY_GROUP_ID}?${queryStr}`
    }
    next()
  }
}
