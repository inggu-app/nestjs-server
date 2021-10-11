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
import { objectKeys } from '../../global/utils/objectKeys'

export class UserJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  async validate(functionality: AvailableFunctionality, user: DocumentType<UserModel>, request: Request) {
    let castedFunctionality
    let requestBody
    let queryParams
    let isCorrectFunctionalities: boolean
    let isCorrectRoles: boolean
    switch (functionality.code) {
      case FunctionalityCodesEnum.USER__CREATE:
        castedFunctionality = functionality as AvailableFunctionality<UserCreateDataForFunctionality>

        if (
          castedFunctionality.data.availableRolesType === FunctionalityAvailableTypeEnum.ALL &&
          castedFunctionality.data.availableFunctionalitiesType === FunctionalityAvailableTypeEnum.ALL
        )
          return true

        isCorrectRoles = true
        requestBody = UserJwtAuthGuard.getBody<CreateUserDto>(request)
        for (const role of requestBody.roles) {
          castedFunctionality = functionality as AvailableFunctionality<UserCreateDataForFunctionality>
          if (!castedFunctionality.data.availableRoles.includes(role)) {
            isCorrectRoles = false
            break
          }
        }
        if (!isCorrectRoles) break

        isCorrectFunctionalities = true
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

        requestBody = UserJwtAuthGuard.getBody<UpdateUserDto>(request)
        //=====================
        // Проверяем доступна ли поля, которые пытается изменить пользователь, ему для изменения
        let isCorrectFields = true
        for (const key of objectKeys(requestBody)) {
          castedFunctionality = functionality as AvailableFunctionality<UserUpdateDataForFunctionality>
          if (!castedFunctionality.data.availableFields.includes(key) && key !== 'id') {
            isCorrectFields = false
            break
          }
        }
        if (!isCorrectFields) break
        //=====================

        //=====================
        // Проверяем доступны ли функциональности, которые пытается установить пользователь, ему для установки
        isCorrectFunctionalities = true
        if (requestBody.available) {
          if (castedFunctionality.data.availableToSetFunctionalitiesType === FunctionalityAvailableTypeEnum.CUSTOM) {
            for (const functionality of requestBody.available) {
              if (
                castedFunctionality.data.forbiddenToSetFunctionalities.includes(functionality.code) ||
                !castedFunctionality.data.availableToSetFunctionalities.includes(functionality.code)
              ) {
                isCorrectFunctionalities = false
                break
              }
            }
            if (!isCorrectFunctionalities) break
          }
        }
        //=====================

        //=====================
        // Проверяем доступны ли роли, которые пытается установить пользователь, ему для установки
        isCorrectRoles = true
        if (requestBody.roles) {
          if (castedFunctionality.data.availableToSetRolesType === FunctionalityAvailableTypeEnum.CUSTOM) {
            for (const role of requestBody.roles) {
              if (
                castedFunctionality.data.forbiddenToSetRoles.includes(role) ||
                !castedFunctionality.data.availableToSetRoles.includes(role)
              ) {
                isCorrectRoles = false
                break
              }
            }
            if (!isCorrectRoles) break
          }
        }
        //=====================

        //=====================
        // Если пользователь пытается обновить специально запрещённых ему пользователей или пользователей с
        // запрещёнными ему ролями, то доступ запрещается
        if (castedFunctionality.data.forbiddenUsers.includes(requestBody.id)) break
        const currentUser = await this.userService.getById(requestBody.id, { fields: ['roles'] })
        if (castedFunctionality.data.forbiddenRoles.reduce((acc, role) => !!currentUser.roles.find(r => r.toString() === role), false))
          break
        //=====================

        //=====================
        // Если пользователю для обновления доступны любые пользователи или если обновляется специально разрешённый пользователь,
        // то доступ разрешается
        if (castedFunctionality.data.availableUsersType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableUsers.includes(requestBody.id)) return true
        //=====================

        //=====================
        // Если пользователь пытается обновить пользователя, среди ролей которого есть хотя бы одно пересечение с ролями
        // доступными изменяющему пользователю, то доступ разрешается
        if (castedFunctionality.data.availableRolesType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableRoles.reduce((acc, role) => !!currentUser.roles.find(r => r.toString() === role), false))
          return true
        //=====================

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
