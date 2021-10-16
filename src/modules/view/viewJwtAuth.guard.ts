import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../global/guards/baseJwtAuth.guard'
import { Request } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import { UserModel } from '../user/user.model'
import { AvailableFunctionality } from '../functionality/functionality.constants'
import { ForbiddenException } from '@nestjs/common'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { ViewGetByUserIdDataForFunctionality, ViewGetQueryParametersEnum } from './view.constants'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'

export class ViewJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  async validate(functionality: AvailableFunctionality, user: DocumentType<UserModel>, request: Request) {
    let castedFunctionality
    let queryParams
    switch (functionality.code) {
      case FunctionalityCodesEnum.VIEW__CREATE:
        return true
      case FunctionalityCodesEnum.VIEW__GET_BY_CODE:
        return true
      case FunctionalityCodesEnum.VIEW__GET_BY_USER_ID:
        castedFunctionality = functionality as AvailableFunctionality<ViewGetByUserIdDataForFunctionality>
        queryParams = parseRequestQueries(getEnumValues(ViewGetQueryParametersEnum), request.url)
        if (!queryParams.userId) return true
        if (castedFunctionality.data.forbiddenUsers.includes(queryParams.userId)) break
        if (castedFunctionality.data.availableUsersType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableUsers.includes(queryParams.userId)) return true
        break
      case FunctionalityCodesEnum.VIEW__UPDATE:
        return true
      case FunctionalityCodesEnum.VIEW__DELETE:
        return true
    }

    throw new ForbiddenException()
  }
}
