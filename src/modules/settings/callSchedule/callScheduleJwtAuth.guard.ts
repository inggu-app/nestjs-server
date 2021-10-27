import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../../global/guards/baseJwtAuth.guard'
import { AvailableFunctionality } from '../../functionality/functionality.constants'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { ForbiddenException } from '@nestjs/common'

export class CallScheduleJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  async validate(functionality: AvailableFunctionality) {
    switch (functionality.code) {
      case FunctionalityCodesEnum.CALL_SCHEDULE__CREATE:
        return true
      case FunctionalityCodesEnum.CALL_SCHEDULE__GET:
        return true
    }
    throw new ForbiddenException()
  }
}
