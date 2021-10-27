import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../../global/guards/baseJwtAuth.guard'
import { AvailableFunctionality } from '../../functionality/functionality.constants'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { ForbiddenException } from '@nestjs/common'

export class AppVersionJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  async validate(functionality: AvailableFunctionality) {
    switch (functionality.code) {
      case FunctionalityCodesEnum.APP_VERSION__CREATE:
        return true
      case FunctionalityCodesEnum.APP_VERSION__POST_FEATURES:
        return true
      case FunctionalityCodesEnum.APP_VERSION__GET:
        return true
      case FunctionalityCodesEnum.APP_VERSION__DELETE:
        return true
    }
    throw new ForbiddenException()
  }
}
