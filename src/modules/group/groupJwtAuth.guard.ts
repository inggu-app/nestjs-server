import { ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common'
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
  GroupGetDataForFunctionality,
  GroupUpdateDataForFunctionality,
} from './group.constants'
import { CreateGroupDto } from './dto/createGroup.dto'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { GroupService } from './group.service'
import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../global/guards/baseJwtAuth.guard'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { ResponsibleService } from '../responsible/responsible.service'

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

  async validate(
    functionalityCode: GroupFunctionalityCodesEnum,
    user: DocumentType<UserModel>,
    context: ExecutionContext
  ): Promise<boolean> {
    const functionality = user.available.find(
      functionality => functionality.code === functionalityCode
    )
    if (!functionality) throw new ForbiddenException()

    let castedFunctionality
    let requestBody
    let currentGroup
    switch (functionalityCode) {
      case FunctionalityCodesEnum.GROUP__CREATE:
        castedFunctionality =
          functionality as AvailableFunctionality<GroupCreateDataForFunctionality>

        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL)
          return true

        requestBody = GroupJwtAuthGuard.getBodyFromContext<CreateGroupDto>(context)
        if (castedFunctionality.data.availableFaculties.includes(requestBody.faculty)) return true
        break
      case FunctionalityCodesEnum.GROUP__GET:
        castedFunctionality = functionality as AvailableFunctionality<GroupGetDataForFunctionality>
        // console.log(
        //   parseRequestQueries(
        //     ['groupId', 'responsibleId', 'facultyId', 'page', 'count', 'title', 'fields'],
        //     context.switchToHttp().getRequest<Request>().url
        //   )
        // )
        break
      case FunctionalityCodesEnum.GROUP__UPDATE:
        castedFunctionality =
          functionality as AvailableFunctionality<GroupUpdateDataForFunctionality>

        requestBody = GroupJwtAuthGuard.getBodyFromContext<UpdateGroupDto>(context)
        if (castedFunctionality.data.forbiddenGroups.includes(requestBody.id)) break
        if (castedFunctionality.data.availableGroups.includes(requestBody.id)) return true
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL)
          return true

        currentGroup = await this.groupService.getById(requestBody.id, ['faculty'])
        if (
          castedFunctionality.data.availableFaculties.includes(String(currentGroup.faculty)) &&
          castedFunctionality.data.availableFaculties.includes(requestBody.faculty)
        )
          return true

        break
      case FunctionalityCodesEnum.GROUP__DELETE:
        castedFunctionality =
          functionality as AvailableFunctionality<GroupDeleteDataForFunctionality>
        const queryParams = GroupJwtAuthGuard.getQueryParameters(['id'], context)
        if (!queryParams.id) return true

        if (castedFunctionality.data.forbiddenGroups.includes(queryParams.id)) break
        if (castedFunctionality.data.availableGroups.includes(queryParams.id)) return true
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL)
          return true

        currentGroup = await this.groupService.getById(queryParams.id, ['faculty'])
        if (castedFunctionality.data.availableFaculties.includes(String(currentGroup.faculty)))
          return true

        break
    }
    throw new ForbiddenException()
  }
}
