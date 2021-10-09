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
  GroupFunctionalityCodesEnum,
  GroupGetByFacultyIdDataForFunctionality,
  GroupGetByGroupIdDataForFunctionality,
  GroupGetByUserIdDataForFunctionality,
  GroupGetManyDataForFunctionality,
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

@Injectable()
export class GroupJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  constructor(
    protected readonly reflector: Reflector,
    @Inject(UserService) protected readonly userService: UserService,
    @Inject(JwtService) protected readonly jwtService: JwtService,
    @Inject(FunctionalityService) private readonly functionalitiesService: FunctionalityService,
    @Inject(GroupService) private readonly groupService: GroupService,
    @Inject(ResponsibleService) private readonly responsibleService: ResponsibleService
  ) {
    super(reflector, userService, jwtService)
  }

  async validate(functionalityCode: GroupFunctionalityCodesEnum, user: DocumentType<UserModel>, request: Request): Promise<boolean> {
    const functionality = user.available.find(functionality => functionality.code === functionalityCode)
    if (!functionality) throw new ForbiddenException()

    let castedFunctionality
    let requestBody
    let currentGroup
    let queryParams
    switch (functionalityCode) {
      case FunctionalityCodesEnum.GROUP__CREATE:
        castedFunctionality = functionality as AvailableFunctionality<GroupCreateDataForFunctionality>

        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true

        requestBody = GroupJwtAuthGuard.getBody<CreateGroupDto>(request)
        if (castedFunctionality.data.availableFaculties.includes(requestBody.faculty)) return true
        break
      case FunctionalityCodesEnum.GROUP__GET_BY_GROUP_ID:
        castedFunctionality = functionality as AvailableFunctionality<GroupGetByGroupIdDataForFunctionality>

        queryParams = GroupJwtAuthGuard.getQueryParameters(['groupId'], request)
        if (!queryParams.groupId) return true

        if (castedFunctionality.data.forbiddenGroups.includes(queryParams.groupId)) break
        if (castedFunctionality.data.availableGroups.includes(queryParams.groupId)) return true

        currentGroup = await this.groupService.getById(queryParams.groupId, ['faculty'])
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableFaculties.includes(currentGroup.faculty.toString())) return true
        break
      case FunctionalityCodesEnum.GROUP__GET_BY_USER_ID:
        castedFunctionality = functionality as AvailableFunctionality<GroupGetByUserIdDataForFunctionality>

        queryParams = GroupJwtAuthGuard.getQueryParameters(['userId'], request)
        if (!queryParams.userId) return true

        if (castedFunctionality.data.availableUsersType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableUsers.includes(queryParams.userId)) return true
        break
      case FunctionalityCodesEnum.GROUP__GET_BY_FACULTY_ID:
        castedFunctionality = functionality as AvailableFunctionality<GroupGetByFacultyIdDataForFunctionality>

        queryParams = GroupJwtAuthGuard.getQueryParameters(['facultyId'], request)
        if (!queryParams.facultyId) return true

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
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true

        currentGroup = await this.groupService.getById(requestBody.id, ['faculty'])
        if (
          castedFunctionality.data.availableFaculties.includes(currentGroup.faculty.toString()) &&
          castedFunctionality.data.availableFaculties.includes(requestBody.faculty)
        )
          return true

        break

      case FunctionalityCodesEnum.GROUP__DELETE:
        castedFunctionality = functionality as AvailableFunctionality<GroupDeleteDataForFunctionality>
        queryParams = GroupJwtAuthGuard.getQueryParameters(['id'], request)
        if (!queryParams.id) return true

        if (castedFunctionality.data.forbiddenGroups.includes(queryParams.id)) break
        if (castedFunctionality.data.availableGroups.includes(queryParams.id)) return true
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true

        currentGroup = await this.groupService.getById(queryParams.id, ['faculty'])
        if (castedFunctionality.data.availableFaculties.includes(currentGroup.faculty.toString())) return true

        break
    }
    throw new ForbiddenException()
  }
}
