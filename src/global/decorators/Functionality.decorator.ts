import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { FunctionalityService } from '../../modules/functionality/functionality.service'
import { RegisterFunctionality } from '../../modules/functionality/functionality.constants'
import { FunctionalityCodesEnum } from '../enums/functionalities.enum'
import { GroupJwtAuthGuard } from '../../modules/group/groupJwtAuth.guard'
import { BaseJwtAuthGuard } from '../guards/baseJwtAuth.guard'
import { FacultyJwtAuthGuard } from '../../modules/faculty/facultyJwtAuth.guard'
import { NoteJwtAuthGuard } from '../../modules/note/noteJwtAuth.guard'
import { ScheduleJwtAuthGuard } from '../../modules/schedule/scheduleJwtAuth.guard'
import { RoleJwtAuthGuard } from '../../modules/role/roleJwtAuth.guard'
import { UserJwtAuthGuard } from '../../modules/user/userJwtAuth.guard'
import { InterfaceJwtAuthGuard } from '../../modules/interface/interfaceJwtAuth.guard'
import { FunctionalityJwtAuthGuard } from '../../modules/functionality/functionalityJwtAuth.guard'

interface FunctionalityDecoratorOptions extends RegisterFunctionality {}

export const Functionality = (options: FunctionalityDecoratorOptions) => {
  FunctionalityService.initializableFunctionalities.push(options)
  return applyDecorators(SetMetadata('code', options.code), UseGuards(getAuthGuard(options.code)))
}

function getAuthGuard(functionalityCode: FunctionalityCodesEnum) {
  switch (functionalityCode) {
    case FunctionalityCodesEnum.GROUP__CREATE:
    case FunctionalityCodesEnum.GROUP__GET_BY_GROUP_ID:
    case FunctionalityCodesEnum.GROUP__GET_BY_USER_ID:
    case FunctionalityCodesEnum.GROUP__GET_BY_FACULTY_ID:
    case FunctionalityCodesEnum.GROUP__GET_MANY:
    case FunctionalityCodesEnum.GROUP__UPDATE:
    case FunctionalityCodesEnum.GROUP__DELETE:
      return GroupJwtAuthGuard
    case FunctionalityCodesEnum.SCHEDULE__CREATE:
    case FunctionalityCodesEnum.SCHEDULE__GET_BY_GROUP_ID:
      return ScheduleJwtAuthGuard
    case FunctionalityCodesEnum.FACULTY__CREATE:
    case FunctionalityCodesEnum.FACULTY__GET_BY_FACULTY_ID:
    case FunctionalityCodesEnum.FACULTY__GET_MANY:
    case FunctionalityCodesEnum.FACULTY__UPDATE:
    case FunctionalityCodesEnum.FACULTY__DELETE:
      return FacultyJwtAuthGuard
    case FunctionalityCodesEnum.NOTE__CREATE:
    case FunctionalityCodesEnum.NOTE__GET_BY_NOTE_ID:
    case FunctionalityCodesEnum.NOTE__GET_BY_LESSON_ID:
    case FunctionalityCodesEnum.NOTE__DELETE:
      return NoteJwtAuthGuard
    case FunctionalityCodesEnum.ROLE__CREATE:
    case FunctionalityCodesEnum.ROLE__GET_BY_ROLE_ID:
    case FunctionalityCodesEnum.ROLE__GET_MANY:
    case FunctionalityCodesEnum.ROLE__UPDATE:
    case FunctionalityCodesEnum.ROLE__DELETE:
      return RoleJwtAuthGuard
    case FunctionalityCodesEnum.USER__CREATE:
    case FunctionalityCodesEnum.USER__GET_BY_USER_ID:
    case FunctionalityCodesEnum.USER__UPDATE:
    case FunctionalityCodesEnum.USER__DELETE:
      return UserJwtAuthGuard
    case FunctionalityCodesEnum.INTERFACE__CREATE:
    case FunctionalityCodesEnum.INTERFACE__GET_BY_CODE:
    case FunctionalityCodesEnum.INTERFACE__UPDATE:
    case FunctionalityCodesEnum.INTERFACE__DELETE:
      return InterfaceJwtAuthGuard
    case FunctionalityCodesEnum.FUNCTIONALITIES__GET:
      return FunctionalityJwtAuthGuard
    default:
      return BaseJwtAuthGuard
  }
}
