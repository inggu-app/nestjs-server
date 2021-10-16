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
import { ConfigService } from '@nestjs/config'
import { GroupModel } from '../group/group.model'

export class NoteJwtAuthGuard extends BaseJwtAuthGuard implements JwtAuthGuardValidate {
  constructor(
    protected readonly reflector: Reflector,
    @Inject(UserService) protected readonly userService: UserService,
    @Inject(JwtService) protected readonly jwtService: JwtService,
    @Inject(ConfigService) protected readonly configService: ConfigService,
    @Inject(NoteService) protected readonly noteService: NoteService,
    @Inject(ScheduleService) protected readonly scheduleService: ScheduleService
  ) {
    super(reflector, userService, jwtService, configService)
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

        requestBody = NoteJwtAuthGuard.getBody<CreateNoteDto>(request)
        lesson = await this.scheduleService.getById(requestBody.lesson, { fields: ['group'], queryOptions: { populate: 'group' } })
        lesson.group = lesson.group as GroupModel
        if (castedFunctionality.data.forbiddenGroups.includes(lesson.group.id.toString())) break
        if (castedFunctionality.data.forbiddenFaculties.includes(lesson.group.faculty.toString())) break
        if (castedFunctionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableFaculties.includes(lesson.group.faculty.toString())) return true
        if (castedFunctionality.data.availableGroups.includes(lesson.group.id.toString())) return true
        break
      case FunctionalityCodesEnum.NOTE__GET_BY_NOTE_ID:
        castedFunctionality = functionality as AvailableFunctionality<NoteGetByNoteIdDataForFunctionality>
        queryParams = parseRequestQueries(getEnumValues(NoteGetQueryParametersEnum), request.url)
        if (!queryParams.noteId) return true
        note = await this.noteService.getById(queryParams.noteId, { fields: ['lesson'] })
        lesson = await this.scheduleService.getById(note.lesson, { fields: ['group'] })
        if (castedFunctionality.data.forbiddenGroups.includes(lesson.group.toString())) break
        if (castedFunctionality.data.availableGroupsType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableGroups.includes(lesson.group.toString())) return true
        break
      case FunctionalityCodesEnum.NOTE__GET_BY_LESSON_ID:
        castedFunctionality = functionality as AvailableFunctionality<NoteGetByLessonIdDataForFunctionality>

        queryParams = parseRequestQueries(getEnumValues(NoteGetQueryParametersEnum), request.url)
        if (!queryParams.lessonId) return true
        lesson = await this.scheduleService.getById(queryParams.lessonId, { fields: ['group'] })
        if (castedFunctionality.data.forbiddenGroups.includes(lesson.group.toString())) break
        if (castedFunctionality.data.availableGroupsType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableGroups.includes(lesson.group.toString())) return true
        break
      case FunctionalityCodesEnum.NOTE__DELETE:
        castedFunctionality = functionality as AvailableFunctionality<NoteDeleteDataForFunctionality>

        queryParams = parseRequestQueries(['noteId'], request.url)
        if (!queryParams.noteId) return true
        note = await this.noteService.getById(queryParams.noteId, { fields: ['lesson'] })
        lesson = await this.scheduleService.getById(note.lesson, { fields: ['group'] })
        if (castedFunctionality.data.forbiddenGroups.includes(lesson.group.toString())) break
        if (castedFunctionality.data.availableGroupsType === FunctionalityAvailableTypeEnum.ALL) return true
        if (castedFunctionality.data.availableGroups.includes(lesson.group.toString())) return true
        break
    }
    throw new ForbiddenException()
  }
}
