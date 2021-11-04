import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../../global/guards/baseJwtAuth.guard'
import { AvailableFunctionality } from '../../functionality/functionality.constants'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { ForbiddenException } from '@nestjs/common'

export class SemesterRangeJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  async validate(functionality: AvailableFunctionality) {
    switch (functionality.code) {
      case FunctionalityCodesEnum.SEMESTER_RANGE__CREATE:
        return true
      case FunctionalityCodesEnum.SEMESTER_RANGE__GET:
        return true
    }

    throw new ForbiddenException()
  }
}
