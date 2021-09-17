import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GroupModel } from './group.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateGroupDto } from './dto/create-group.dto'
import { Types } from 'mongoose'
import { GroupField } from './group.constants'
import { ResponsibleService } from '../responsible/responsible.service'
import { CreateScheduleDto } from '../schedule/dto/create-schedule.dto'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { FacultyService } from '../faculty/faculty.service'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import {
  FACULTY_WITH_ID_NOT_FOUND,
  GROUP_WITH_ID_NOT_FOUND,
  GROUP_WITH_TITLE_EXISTS,
} from '../../global/constants/errors.constants'

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(GroupModel) private readonly groupModel: ModelType<GroupModel>,
    @Inject(forwardRef(() => ResponsibleService))
    private readonly responsibleService: ResponsibleService,
    private readonly facultyService: FacultyService
  ) {}

  async create(dto: CreateGroupDto) {
    const candidate = await this.groupModel.findOne({ title: dto.title, faculty: dto.faculty })

    if (candidate) {
      throw new HttpException(GROUP_WITH_TITLE_EXISTS(dto.title), HttpStatus.BAD_REQUEST)
    }
    return this.groupModel.create(dto)
  }

  async getById(groupId: Types.ObjectId, fields?: GroupField[]) {
    const candidate = await this.groupModel.findById(groupId, fieldsArrayToProjection(fields))

    if (!candidate) {
      throw new HttpException(GROUP_WITH_ID_NOT_FOUND(groupId), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  getAll(page: number, count: number, title?: string, fields?: GroupField[]) {
    return this.groupModel
      .find(
        title ? { title: { $regex: title, $options: 'i' } } : {},
        fieldsArrayToProjection(fields)
      )
      .skip((page - 1) * count)
      .limit(count)
  }

  countAll(title?: string) {
    return this.groupModel.countDocuments(title ? { title: { $regex: title, $options: 'i' } } : {})
  }

  async getByFacultyId(facultyId: Types.ObjectId, fields?: GroupField[]) {
    const faculty = await this.facultyService.getById(facultyId)

    if (!faculty) {
      throw new HttpException(FACULTY_WITH_ID_NOT_FOUND(facultyId), HttpStatus.NOT_FOUND)
    }

    return this.groupModel.find({ faculty: facultyId }, fieldsArrayToProjection(fields))
  }

  async delete(groupId: Types.ObjectId) {
    const candidate = await this.groupModel.deleteOne({ _id: groupId })

    await this.responsibleService.deleteGroupsFromAllResponsibles([groupId])

    if (!candidate.deletedCount) {
      throw new HttpException(GROUP_WITH_ID_NOT_FOUND(groupId), HttpStatus.NOT_FOUND)
    }
  }

  async deleteAllByFacultyId(facultyId: Types.ObjectId) {
    const groups = await this.groupModel.find({ faculty: facultyId })
    const groupsIds: Types.ObjectId[] = groups.map(group => group.id)

    await this.responsibleService.deleteGroupsFromAllResponsibles(groupsIds)
    return this.groupModel.deleteMany({ faculty: facultyId })
  }

  updateLastScheduleUpdate(dto: CreateScheduleDto, date: Date) {
    return this.groupModel.findByIdAndUpdate(dto.group, {
      $set: { lastScheduleUpdate: date, isHaveSchedule: !!dto.schedule.length },
    })
  }

  async update(dto: UpdateGroupDto) {
    const candidate = await this.groupModel.findByIdAndUpdate(dto.id, {
      $set: { title: dto.title, faculty: dto.faculty },
    })

    if (!candidate) {
      throw new HttpException(GROUP_WITH_ID_NOT_FOUND(dto.id), HttpStatus.NOT_FOUND)
    }

    return this.groupModel.findById(dto.id)
  }
}
