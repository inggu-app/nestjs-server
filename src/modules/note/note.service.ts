import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { NoteModel } from './note.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateNoteDto } from './dto/createNoteDto'
import { WeekDaysEnum } from '../../global/enums/WeekDays'
import { Types } from 'mongoose'
import { NoteField, NoteForbiddenFieldsEnum } from './note.constants'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import {
  GROUP_WITH_ID_NOT_FOUND,
  NOTE_WITH_ID_NOT_FOUND,
} from '../../global/constants/errors.constants'
import { GroupService } from '../group/group.service'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { TypesEnum } from '../../global/enums/types'

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(NoteModel) private readonly noteModel: ModelType<NoteModel>,
    private readonly groupService: GroupService
  ) {}

  async create(dto: CreateNoteDto) {
    const groupCandidate = await this.groupService.getById(dto.group)

    if (!groupCandidate) {
      throw new HttpException(GROUP_WITH_ID_NOT_FOUND(dto.group), HttpStatus.NOT_FOUND)
    }

    return this.noteModel.create(dto)
  }

  async get(
    group: Types.ObjectId,
    week: number,
    weekDay: WeekDaysEnum,
    lessonNumber: number,
    fields?: NoteField[]
  ) {
    const groupCandidate = await this.groupService.getById(group)

    if (!groupCandidate) {
      throw new HttpException(GROUP_WITH_ID_NOT_FOUND(group), HttpStatus.BAD_REQUEST)
    }

    console.log(getEnumValues(NoteForbiddenFieldsEnum, TypesEnum.STRING))
    return this.noteModel.find(
      { group, week, weekDay, lessonNumber },
      fieldsArrayToProjection(fields, [], getEnumValues(NoteForbiddenFieldsEnum, TypesEnum.STRING))
    )
  }

  async getById(id: Types.ObjectId, fields?: NoteField[]) {
    const candidate = await this.noteModel.findById(
      id,
      fieldsArrayToProjection(fields, [], getEnumValues(NoteForbiddenFieldsEnum, TypesEnum.STRING))
    )

    if (!candidate) {
      throw new HttpException(NOTE_WITH_ID_NOT_FOUND(id), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  delete(id: Types.ObjectId) {
    return this.noteModel.findByIdAndDelete(id)
  }
}
