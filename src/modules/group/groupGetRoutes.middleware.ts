import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { GroupGetQueryParametersEnum, GroupRoutesEnum } from './group.constants'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'

@Injectable()
export class GroupGetRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const query = parseRequestQueries(getEnumValues(GroupGetQueryParametersEnum), req.url)

    const request = checkAlternativeQueryParameters<GroupRoutesEnum>(
      { required: { groupId: query.groupId }, fields: query.fields, enum: GroupRoutesEnum.GET_BY_GROUP_ID },
      { required: { groupIds: query.groupIds }, fields: query.fields, enum: GroupRoutesEnum.GET_BY_GROUP_IDS },
      { required: { userId: query.userId }, fields: query.fields, enum: GroupRoutesEnum.GET_BY_USER_ID },
      { required: { facultyId: query.facultyId }, fields: query.count, enum: GroupRoutesEnum.GET_BY_FACULTY_ID },
      { required: { page: query.page, count: query.count }, title: query.title, fields: query.fields, enum: GroupRoutesEnum.GET_MANY }
    )

    const [start, queryStr] = req.url.split('?')
    switch (request.enum) {
      case GroupRoutesEnum.GET_BY_GROUP_ID:
        req.url = `${start}${GroupRoutesEnum.GET_BY_GROUP_ID}?${queryStr}`
        break
      case GroupRoutesEnum.GET_BY_GROUP_IDS:
        req.url = `${start}${GroupRoutesEnum.GET_BY_GROUP_IDS}?${queryStr}`
        break
      case GroupRoutesEnum.GET_BY_USER_ID:
        req.url = `${start}${GroupRoutesEnum.GET_BY_USER_ID}?${queryStr}`
        break
      case GroupRoutesEnum.GET_BY_FACULTY_ID:
        req.url = `${start}${GroupRoutesEnum.GET_BY_FACULTY_ID}?${queryStr}`
        break
      case GroupRoutesEnum.GET_MANY:
        req.url = `${start}${GroupRoutesEnum.GET_MANY}?${queryStr}`
        break
    }
    next()
  }
}
