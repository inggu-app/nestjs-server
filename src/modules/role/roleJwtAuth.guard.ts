import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../global/guards/baseJwtAuth.guard'
import { Request } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { UserModel } from '../user/user.model'
import { ForbiddenException } from '@nestjs/common'
import { AvailableFunctionality } from '../functionality/functionality.constants'
import {
  RoleDeleteDataForFunctionality,
  RoleGetByRoleIdDataForFunctionality,
  RoleGetQueryParametersEnum,
  RoleUpdateDataForFunctionality,
} from './role.constants'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { UpdateRoleDto } from './dto/updateRole.dto'

export class RoleJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  async validate(functionalityCode: FunctionalityCodesEnum, user: DocumentType<UserModel>, request: Request) {
    const functionality = user.available.find(functionality => functionality.code === functionalityCode)
    if (!functionality) throw new ForbiddenException()

    let castedFunctionality
    let queryParams
    let requestBody
    switch (functionality.code) {
      case FunctionalityCodesEnum.ROLE__CREATE:
        return true
      case FunctionalityCodesEnum.ROLE__GET_BY_ROLE_ID:
        castedFunctionality = functionality as AvailableFunctionality<RoleGetByRoleIdDataForFunctionality>

        if (castedFunctionality.data.availableRolesType === FunctionalityAvailableTypeEnum.ALL) return true
        queryParams = parseRequestQueries(getEnumValues(RoleGetQueryParametersEnum), request.url)
        if (!queryParams.roleId) return true
        if (castedFunctionality.data.availableRoles.includes(queryParams.roleId)) return true
        break
      case FunctionalityCodesEnum.ROLE__GET_MANY:
        return true
      case FunctionalityCodesEnum.ROLE__UPDATE:
        castedFunctionality = functionality as AvailableFunctionality<RoleUpdateDataForFunctionality>

        if (castedFunctionality.data.availableFunctionalitiesType === FunctionalityAvailableTypeEnum.ALL) return true
        let isCorrect = true
        requestBody = RoleJwtAuthGuard.getBody<UpdateRoleDto>(request) as UpdateRoleDto
        requestBody.functionalities.forEach(f => {
          castedFunctionality = functionality as AvailableFunctionality<RoleUpdateDataForFunctionality>
          if (!castedFunctionality.data.availableFunctionalities.includes(f.code)) isCorrect = false
        })
        if (!isCorrect) break
        break
      case FunctionalityCodesEnum.ROLE__DELETE:
        castedFunctionality = functionality as AvailableFunctionality<RoleDeleteDataForFunctionality>

        if (castedFunctionality.data.availableRolesType === FunctionalityAvailableTypeEnum.ALL) return true
        queryParams = parseRequestQueries(['roleId'], request.url)
        if (!queryParams.roleId) return true
        if (castedFunctionality.data.availableRoles.includes(queryParams.roleId)) return true
        break
    }

    throw new ForbiddenException()
  }
}
