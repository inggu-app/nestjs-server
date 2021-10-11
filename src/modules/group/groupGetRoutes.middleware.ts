import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { GetGroupsEnum, GroupGetQueryParametersEnum, GroupRoutesEnum } from './group.constants'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'

@Injectable()
export class GroupGetRoutesMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const query = parseRequestQueries(getEnumValues(GroupGetQueryParametersEnum), req.url)

    const request = checkAlternativeQueryParameters<GetGroupsEnum>(
      { required: { groupId: query.groupId }, fields: query.fields, enum: GetGroupsEnum.groupId },
      { required: { userId: query.userId }, fields: query.fields, enum: GetGroupsEnum.userId },
      { required: { facultyId: query.facultyId }, fields: query.count, enum: GetGroupsEnum.facultyId },
      { required: { page: query.page, count: query.count }, title: query.title, fields: query.fields, enum: GetGroupsEnum.many }
    )

    switch (request.enum) {
      case GetGroupsEnum.groupId:
        req.url = GroupRoutesEnum.GET_BY_GROUP_ID + req.url
        break
      case GetGroupsEnum.userId:
        req.url = GroupRoutesEnum.GET_BY_USER_ID + req.url
        break
      case GetGroupsEnum.facultyId:
        req.url = GroupRoutesEnum.GET_BY_FACULTY_ID + req.url
        break
      case GetGroupsEnum.many:
        req.url = GroupRoutesEnum.GET_MANY + req.url
        break
    }
    next()
  }
}
