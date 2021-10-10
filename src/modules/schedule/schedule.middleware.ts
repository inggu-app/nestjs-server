import { NestMiddleware } from '@nestjs/common'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { GetScheduleEnum, ScheduleGetQueryParametersEnum, ScheduleRoutesEnum } from './schedule.constants'
import { Request } from 'express'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'

export class ScheduleRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    const query = parseRequestQueries(getEnumValues(ScheduleGetQueryParametersEnum), req.url)

    const request = checkAlternativeQueryParameters<GetScheduleEnum>({
      required: { groupId: query.groupId },
      fields: query.fields,
      updatedAt: query.updatedAt,
      enum: GetScheduleEnum.groupId,
    })

    switch (request.enum) {
      case GetScheduleEnum.groupId:
        req.url = ScheduleRoutesEnum.GET_BY_GROUP_ID + req.url
    }
    next()
  }
}
