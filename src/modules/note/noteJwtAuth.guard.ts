import { BaseJwtAuthGuard, JwtAuthGuardValidate } from '../../global/guards/baseJwtAuth.guard'
import { Request } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { UserModel } from '../user/user.model'
import { ForbiddenException, Inject } from '@nestjs/common'
import { AvailableFunctionality } from '../functionality/functionality.constants'
import {
  NoteCreateDataForFunctionality,
  NoteDeleteDataForFunctionality,
  NoteGetByLessonIdDataForFunctionality,
  NoteGetByNoteIdDataForFunctionality,
  NoteGetQueryParametersEnum,
} from './note.constants'
import { CreateNoteDto } from './dto/createNoteDto'
import { Reflector } from '@nestjs/core'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { NoteService } from './note.service'
import { ScheduleService } from '../schedule/schedule.service'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { parseRequestQueries } from '../../global/utils/parseRequestQueries'
import { getEnumValues } from '../../global/utils/enumKeysValues'

export class NoteJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  constructor(
    protected readonly reflector: Reflector,
    @Inject(UserService) protected readonly userService: UserService,
    @Inject(JwtService) protected readonly jwtService: JwtService,
    @Inject(NoteService) protected readonly noteService: NoteService,
    @Inject(ScheduleService) protected readonly scheduleService: ScheduleService
  ) {
    super(reflector, userService, jwtService)
  }
  async validate(functionality: AvailableFunctionality, user: DocumentType<UserModel>, request: Request) {
    let castedFunctionality
    let requestBody
    let queryParams
    let lesson
    let note
    switch (functionality.code) {
      case FunctionalityCodesEnum.NOTE__CREATE:
        castedFunctionality = functionality as AvailableFunctionality<NoteCreateDataForFunctionality>

        if (castedFunctionality.data.availableGroupsType === FunctionalityAvailableTypeEnum.ALL) return true

        requestBody = NoteJwtAuthGuard.getBody<CreateNoteDto>(request)
        lesson = await this.scheduleService.getById(requestBody.lesson, ['group'])
        if (castedFunctionality.data.forbiddenGroups.includes(lesson.group.toString())) break
        if (castedFunctionality.data.availableGroups.includes(lesson.group.toString())) return true
        break
      case FunctionalityCodesEnum.NOTE__GET_BY_NOTE_ID:
        castedFunctionality = functionality as AvailableFunctionality<NoteGetByNoteIdDataForFunctionality>

        if (castedFunctionality.data.availableGroupsType === FunctionalityAvailableTypeEnum.ALL) return true

        queryParams = parseRequestQueries(getEnumValues(NoteGetQueryParametersEnum), request.url)
        if (!queryParams.noteId) return true
        note = await this.noteService.getById(queryParams.noteId, ['lesson'])
        lesson = await this.scheduleService.getById(note.lesson, ['group'])
        if (castedFunctionality.data.forbiddenGroups.includes(lesson.group.toString())) break
        if (castedFunctionality.data.availableGroups.includes(lesson.group.toString())) return true
        break
      case FunctionalityCodesEnum.NOTE__GET_BY_LESSON_ID:
        castedFunctionality = functionality as AvailableFunctionality<NoteGetByLessonIdDataForFunctionality>

        if (castedFunctionality.data.availableGroupsType === FunctionalityAvailableTypeEnum.ALL) return true

        queryParams = parseRequestQueries(getEnumValues(NoteGetQueryParametersEnum), request.url)
        if (!queryParams.lessonId) return true
        lesson = await this.scheduleService.getById(queryParams.lessonId, ['group'])
        if (castedFunctionality.data.forbiddenGroups.includes(lesson.group.toString())) break
        if (castedFunctionality.data.availableGroups.includes(lesson.group.toString())) return true
        break
      case FunctionalityCodesEnum.NOTE__DELETE:
        castedFunctionality = functionality as AvailableFunctionality<NoteDeleteDataForFunctionality>

        if (castedFunctionality.data.availableGroupsType === FunctionalityAvailableTypeEnum.ALL) return true

        queryParams = parseRequestQueries(['id'], request.url)
        if (!queryParams.id) return true
        note = await this.noteService.getById(queryParams.id, ['lesson'])
        lesson = await this.scheduleService.getById(note.lesson, ['group'])
        if (castedFunctionality.data.forbiddenGroups.includes(lesson.group.toString())) break
        if (castedFunctionality.data.availableGroups.includes(lesson.group.toString())) return true
        break
    }
    throw new ForbiddenException()
  }
}
