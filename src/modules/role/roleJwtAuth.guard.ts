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
import { objectKeys } from '../../global/utils/objectKeys'

export class RoleJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  async validate(functionality: AvailableFunctionality, user: DocumentType<UserModel>, request: Request) {
    console.log(functionality)
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

        requestBody = RoleJwtAuthGuard.getBody<UpdateRoleDto>(request) as UpdateRoleDto
        if (
          castedFunctionality.data.availableRolesType !== FunctionalityAvailableTypeEnum.ALL &&
          !castedFunctionality.data.availableRoles.includes(requestBody.id)
        )
          break

        //=====================
        // Проверяем доступна ли поля, которые пытается изменить пользователь, ему для изменения
        let isCorrectFields = true
        for (const key of objectKeys(requestBody)) {
          castedFunctionality = functionality as AvailableFunctionality<RoleUpdateDataForFunctionality>
          if (!castedFunctionality.data.availableFields.includes(key) && key !== 'id') {
            isCorrectFields = false
            break
          }
        }
        if (!isCorrectFields) break
        //=====================

        if (castedFunctionality.data.availableFunctionalitiesType === FunctionalityAvailableTypeEnum.ALL) return true
        let isCorrect = true
        requestBody.available?.forEach(f => {
          castedFunctionality = functionality as AvailableFunctionality<RoleUpdateDataForFunctionality>
          if (!castedFunctionality.data.availableFunctionalities.includes(f)) isCorrect = false
        })
        if (!isCorrect) break

        return true
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
