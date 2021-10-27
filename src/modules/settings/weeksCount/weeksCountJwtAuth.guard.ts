import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../../global/guards/baseJwtAuth.guard'
import { AvailableFunctionality } from '../../functionality/functionality.constants'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { ForbiddenException } from '@nestjs/common'

export class WeeksCountJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  async validate(functionality: AvailableFunctionality) {
    switch (functionality.code) {
      case FunctionalityCodesEnum.WEEKS_COUNT__CREATE:
        return true
      case FunctionalityCodesEnum.WEEKS_COUNT__GET:
        return true
    }

    throw new ForbiddenException()
  }
}
