import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../global/guards/baseJwtAuth.guard'
import { Request } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import { UserModel } from './user.model'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { ForbiddenException } from '@nestjs/common'
import { AvailableFunctionality } from '../functionality/functionality.constants'
import {
  UserCreateDataForFunctionality,
  UserDeleteDataForFunctionality,
  UserGetByUserIdDataForFunctionality,
  UserGetQueryParametersEnum,
  UserUpdateDataForFunctionality,
} from './user.constants'
import { CreateUserDto } from './dto/createUser.dto'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { UpdateUserDto } from './dto/updateUser.dto'

export class UserJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  async validate(functionality: AvailableFunctionality, user: DocumentType<UserModel>, request: Request) {
    let castedFunctionality
    let requestBody
    let queryParams
    switch (functionality.code) {
      case FunctionalityCodesEnum.USER__CREATE:
        castedFunctionality = functionality as AvailableFunctionality<UserCreateDataForFunctionality>

        if (
          castedFunctionality.data.availableRolesType === FunctionalityAvailableTypeEnum.ALL &&
          castedFunctionality.data.availableFunctionalitiesType === FunctionalityAvailableTypeEnum.ALL
        )
          return true

        let isCorrectRoles = true
        requestBody = UserJwtAuthGuard.getBody<CreateUserDto>(request)
        for (const role of requestBody.roles) {
          castedFunctionality = functionality as AvailableFunctionality<UserCreateDataForFunctionality>
          if (!castedFunctionality.data.availableRoles.includes(role)) {
            isCorrectRoles = false
            break
          }
        }
        if (!isCorrectRoles) break

        let isCorrectFunctionalities = true
        for (const f of requestBody.available) {
          castedFunctionality = functionality as AvailableFunctionality<UserCreateDataForFunctionality>
          if (!castedFunctionality.data.availableFunctionalities.includes(f.code)) {
            isCorrectFunctionalities = false
            break
          }
        }
        if (!isCorrectFunctionalities) break

        return true
      case FunctionalityCodesEnum.USER__GET_BY_USER_ID:
        castedFunctionality = functionality as AvailableFunctionality<UserGetByUserIdDataForFunctionality>

        if (castedFunctionality.data.availableUsersType === FunctionalityAvailableTypeEnum.ALL) return true

        queryParams = parseRequestQueries(getEnumValues(UserGetQueryParametersEnum), request.url)
        if (!queryParams.userId) return true
        if (castedFunctionality.data.availableUsers.includes(queryParams.userId)) return true
        break
      case FunctionalityCodesEnum.USER__UPDATE:
        castedFunctionality = functionality as AvailableFunctionality<UserUpdateDataForFunctionality>

        if (castedFunctionality.data.availableUsersType === FunctionalityAvailableTypeEnum.ALL) return true

        requestBody = UserJwtAuthGuard.getBody<UpdateUserDto>(request)
        if (castedFunctionality.data.availableUsers.includes(requestBody.id)) return true
        break
      case FunctionalityCodesEnum.USER__DELETE:
        castedFunctionality = functionality as AvailableFunctionality<UserDeleteDataForFunctionality>

        if (castedFunctionality.data.availableUsersType === FunctionalityAvailableTypeEnum.ALL) return true
        queryParams = parseRequestQueries(['userId'], request.url)
        if (!queryParams.userId) return true
        if (castedFunctionality.data.availableUsers.includes(queryParams.userId)) return true
        break
    }

    throw new ForbiddenException()
  }
}
