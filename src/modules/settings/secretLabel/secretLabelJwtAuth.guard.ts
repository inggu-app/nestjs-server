import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../../global/guards/baseJwtAuth.guard'
import { AvailableFunctionality } from '../../functionality/functionality.constants'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { ForbiddenException } from '@nestjs/common'

export class SecretLabelJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  async validate(functionality: AvailableFunctionality) {
    switch (functionality.code) {
      case FunctionalityCodesEnum.SECRET_LABEL__CREATE:
        return true
      case FunctionalityCodesEnum.SECRET_LABEL__GET:
        return true
    }

    throw new ForbiddenException()
  }
}
