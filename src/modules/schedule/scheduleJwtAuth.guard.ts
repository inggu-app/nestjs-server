import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../global/guards/baseJwtAuth.guard'
import { Request } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import { UserModel } from '../user/user.model'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { ForbiddenException, Inject } from '@nestjs/common'
import { AvailableFunctionality } from '../functionality/functionality.constants'
import {
  ScheduleCreateDataForFunctionality,
  ScheduleGetByGroupIdDataForFunctionality,
  ScheduleGetQueryParametersEnum,
} from './schedule.constants'
import { CreateScheduleDto } from './dto/createSchedule.dto'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { Reflector } from '@nestjs/core'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { GroupService } from '../group/group.service'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'

export class ScheduleJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  constructor(
    protected readonly reflector: Reflector,
    @Inject(UserService) protected readonly userService: UserService,
    @Inject(JwtService) protected readonly jwtService: JwtService,
    @Inject(GroupService) protected readonly groupService: GroupService
  ) {
    super(reflector, userService, jwtService)
  }

  async validate(functionalityCode: FunctionalityCodesEnum, user: DocumentType<UserModel>, request: Request) {
    const functionality = user.available.find(functionality => functionality.code === functionalityCode)
    if (!functionality) throw new ForbiddenException()

    let castedFunctionality
    let requestBody
    let group
    let queryParams
    switch (functionality.code) {
      case FunctionalityCodesEnum.SCHEDULE__CREATE:
        castedFunctionality = functionality as AvailableFunctionality<ScheduleCreateDataForFunctionality>

        requestBody = ScheduleJwtAuthGuard.getBody<CreateScheduleDto>(request)
        if (castedFunctionality.data.forbiddenGroups.includes(requestBody.group)) break
        if (castedFunctionality.data.availableGroups.includes(requestBody.group)) return true
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true
        group = await this.groupService.getById(requestBody.group, ['faculty'])
        if (castedFunctionality.data.availableFaculties.includes(group.faculty.toString())) return true
        break
      case FunctionalityCodesEnum.SCHEDULE__GET_BY_GROUP_ID:
        castedFunctionality = functionality as AvailableFunctionality<ScheduleGetByGroupIdDataForFunctionality>

        queryParams = parseRequestQueries(getEnumValues(ScheduleGetQueryParametersEnum), request.url)
        if (!queryParams.groupId) return true
        if (castedFunctionality.data.forbiddenGroups.includes(queryParams.groupId)) break
        if (castedFunctionality.data.availableGroups.includes(queryParams.groupId)) return true
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true
        group = await this.groupService.getById(queryParams.groupId, ['faculty'])
        if (castedFunctionality.data.availableFaculties.includes(group.faculty.toString())) return true
        break
    }

    throw new ForbiddenException()
  }
}
