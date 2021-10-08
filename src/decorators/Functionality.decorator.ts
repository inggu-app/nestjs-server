import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { FunctionalityService } from '../modules/functionality/functionality.service'
import { RegisterFunctionality } from '../modules/functionality/functionality.constants'
import { FunctionalityCodesEnum } from '../global/enums/functionalities.enum'
import { GroupJwtAuthGuard } from '../modules/group/groupJwtAuth.guard'
import { BaseJwtAuthGuard } from '../global/guards/baseJwtAuth.guard'

interface FunctionalityDecoratorOptions extends RegisterFunctionality {}

export const Functionality = (options: FunctionalityDecoratorOptions) => {
  FunctionalityService.initializableFunctionalities.push(options)
  return applyDecorators(SetMetadata('code', options.code), UseGuards(getAuthGuard(options.code)))
}

function getAuthGuard(functionalityCode: FunctionalityCodesEnum) {
  switch (functionalityCode) {
    case FunctionalityCodesEnum.GROUP__CREATE:
    case FunctionalityCodesEnum.GROUP__GET_BY_GROUP_ID:
    case FunctionalityCodesEnum.GROUP__GET_BY_RESPONSIBLE_ID:
    case FunctionalityCodesEnum.GROUP__GET_BY_FACULTY_ID:
    case FunctionalityCodesEnum.GROUP__GET_MANY:
    case FunctionalityCodesEnum.GROUP__UPDATE:
    case FunctionalityCodesEnum.GROUP__DELETE:
      return GroupJwtAuthGuard
    default:
      return BaseJwtAuthGuard
  }
}
