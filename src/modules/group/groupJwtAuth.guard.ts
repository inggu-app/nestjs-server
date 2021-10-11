import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { DocumentType } from '@typegoose/typegoose'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { FunctionalityService } from '../functionality/functionality.service'
import { UserModel } from '../user/user.model'
import { AvailableFunctionality } from '../functionality/functionality.constants'
import {
  GroupCreateDataForFunctionality,
  GroupDeleteDataForFunctionality,
  GroupGetByFacultyIdDataForFunctionality,
  GroupGetByGroupIdDataForFunctionality,
  GroupGetByUserIdDataForFunctionality,
  GroupGetManyDataForFunctionality,
  GroupGetQueryParametersEnum,
  GroupUpdateDataForFunctionality,
} from './group.constants'
import { CreateGroupDto } from './dto/createGroup.dto'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { GroupService } from './group.service'
import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../global/guards/baseJwtAuth.guard'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { ResponsibleService } from '../responsible/responsible.service'
import { Request } from 'express'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class GroupJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  constructor(
    protected readonly reflector: Reflector,
    @Inject(UserService) protected readonly userService: UserService,
    @Inject(JwtService) protected readonly jwtService: JwtService,
    @Inject(ConfigService) protected readonly configService: ConfigService,
    @Inject(FunctionalityService) private readonly functionalitiesService: FunctionalityService,
    @Inject(GroupService) private readonly groupService: GroupService,
    @Inject(ResponsibleService) private readonly responsibleService: ResponsibleService
  ) {
    super(reflector, userService, jwtService, configService)
  }

  async validate(functionality: AvailableFunctionality, user: DocumentType<UserModel>, request: Request) {
    let castedFunctionality
    let requestBody
    let currentGroup
    let queryParams
    switch (functionality.code) {
      case FunctionalityCodesEnum.GROUP__CREATE:
        castedFunctionality = functionality as AvailableFunctionality<GroupCreateDataForFunctionality>

        requestBody = GroupJwtAuthGuard.getBody<CreateGroupDto>(request)
        if (castedFunctionality.data.forbiddenFaculties.includes(requestBody.faculty)) break
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableFaculties.includes(requestBody.faculty)) return true
        break
      case FunctionalityCodesEnum.GROUP__GET_BY_GROUP_ID:
        castedFunctionality = functionality as AvailableFunctionality<GroupGetByGroupIdDataForFunctionality>

        queryParams = parseRequestQueries(getEnumValues(GroupGetQueryParametersEnum), request.url)
        if (!queryParams.groupId) return true
        if (castedFunctionality.data.forbiddenGroups.includes(queryParams.groupId)) break
        if (castedFunctionality.data.availableGroups.includes(queryParams.groupId)) return true
        currentGroup = await this.groupService.getById(queryParams.groupId, ['faculty'])
        if (castedFunctionality.data.forbiddenFaculties.includes(String(currentGroup.faculty))) break
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableFaculties.includes(String(currentGroup.faculty))) return true
        break
      case FunctionalityCodesEnum.GROUP__GET_BY_USER_ID:
        castedFunctionality = functionality as AvailableFunctionality<GroupGetByUserIdDataForFunctionality>

        queryParams = parseRequestQueries(getEnumValues(GroupGetQueryParametersEnum), request.url)
        if (!queryParams.userId) return true
        if (castedFunctionality.data.forbiddenUsers.includes(queryParams.userId)) break
        if (castedFunctionality.data.availableUsersType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableUsers.includes(queryParams.userId)) return true
        break
      case FunctionalityCodesEnum.GROUP__GET_BY_FACULTY_ID:
        castedFunctionality = functionality as AvailableFunctionality<GroupGetByFacultyIdDataForFunctionality>

        queryParams = parseRequestQueries(getEnumValues(GroupGetQueryParametersEnum), request.url)
        if (!queryParams.facultyId) return true
        if (castedFunctionality.data.forbiddenFaculties.includes(queryParams.facultyId)) break
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableFaculties.includes(queryParams.facultyId)) return true
        break
      case FunctionalityCodesEnum.GROUP__GET_MANY:
        castedFunctionality = functionality as AvailableFunctionality<GroupGetManyDataForFunctionality>

        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableFaculties.length || castedFunctionality.data.availableGroups) return true
        break
      case FunctionalityCodesEnum.GROUP__UPDATE:
        castedFunctionality = functionality as AvailableFunctionality<GroupUpdateDataForFunctionality>

        requestBody = GroupJwtAuthGuard.getBody<UpdateGroupDto>(request)
        if (castedFunctionality.data.forbiddenGroups.includes(requestBody.id)) break
        if (castedFunctionality.data.availableGroups.includes(requestBody.id)) return true
        currentGroup = await this.groupService.getById(requestBody.id, ['faculty'])
        if (castedFunctionality.data.forbiddenFaculties.includes(String(currentGroup.faculty))) break
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true
        if (
          castedFunctionality.data.availableFaculties.includes(String(currentGroup.faculty)) &&
          castedFunctionality.data.availableFaculties.includes(requestBody.faculty)
        )
          return true
        break
      case FunctionalityCodesEnum.GROUP__DELETE:
        castedFunctionality = functionality as AvailableFunctionality<GroupDeleteDataForFunctionality>

        queryParams = parseRequestQueries(['id'], request.url)
        if (!queryParams.id) return true
        if (castedFunctionality.data.forbiddenGroups.includes(queryParams.id)) break
        if (castedFunctionality.data.availableGroups.includes(queryParams.id)) return true
        currentGroup = await this.groupService.getById(queryParams.id, ['faculty'])
        if (castedFunctionality.data.forbiddenFaculties.includes(String(currentGroup.faculty))) break
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableFaculties.includes(String(currentGroup.faculty))) return true

        break
    }
    throw new ForbiddenException()
  }
}
