import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../global/guards/baseJwtAuth.guard'
import { AvailableFunctionality } from '../functionality/functionality.constants'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { ForbiddenException } from '@nestjs/common'

export class InterfaceJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  async validate(functionality: AvailableFunctionality) {
    switch (functionality.code) {
      case FunctionalityCodesEnum.INTERFACE__CREATE:
        return true
      case FunctionalityCodesEnum.INTERFACE__GET_BY_CODE:
        return true
      case FunctionalityCodesEnum.INTERFACE__UPDATE:
        return true
      case FunctionalityCodesEnum.INTERFACE__DELETE:
        return true
    }
    throw new ForbiddenException()
  }
}
