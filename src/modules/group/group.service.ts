import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GroupModel } from './group.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateGroupDto } from './dto/create-group.dto'
import { Types } from 'mongoose'
import { GroupField, GroupFieldsEnum } from './group.constants'
import { ResponsibleService } from '../responsible/responsible.service'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { FacultyService } from '../faculty/faculty.service'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import {
  FACULTY_WITH_ID_NOT_FOUND,
  GROUP_WITH_ID_NOT_FOUND,
  GROUP_WITH_TITLE_EXISTS,
} from '../../global/constants/errors.constants'
import { ModelBase, ObjectByInterface } from '../../global/types'

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(GroupModel) private readonly groupModel: ModelType<GroupModel>,
    @Inject(forwardRef(() => ResponsibleService))
    private readonly responsibleService: ResponsibleService,
    private readonly facultyService: FacultyService
  ) {}

  async create(dto: CreateGroupDto) {
    const candidate = await this.groupModel
      .findOne({ title: dto.title, faculty: dto.faculty })
      .exec()

    if (candidate) {
      throw new HttpException(GROUP_WITH_TITLE_EXISTS(dto.title), HttpStatus.BAD_REQUEST)
    }
    return this.groupModel.create(dto)
  }

  async getById(groupId: Types.ObjectId, fields?: GroupField[]) {
    const candidate = await this.groupModel
      .findById(groupId, fieldsArrayToProjection(fields))
      .exec()

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
      .exec()
  }

  countAll(title?: string) {
    return this.groupModel
      .countDocuments(title ? { title: { $regex: title, $options: 'i' } } : {})
      .exec()
  }

  async getByFacultyId(facultyId: Types.ObjectId, fields?: GroupField[]) {
    const faculty = await this.facultyService.getById(facultyId)

    if (!faculty) {
      throw new HttpException(FACULTY_WITH_ID_NOT_FOUND(facultyId), HttpStatus.NOT_FOUND)
    }

    return this.groupModel.find({ faculty: facultyId }, fieldsArrayToProjection(fields)).exec()
  }

  async delete(groupId: Types.ObjectId) {
    const candidate = await this.groupModel.deleteOne({ _id: groupId }).exec()

    await this.responsibleService.deleteGroupsFromAllResponsibles([groupId])

    if (!candidate.deletedCount) {
      throw new HttpException(GROUP_WITH_ID_NOT_FOUND(groupId), HttpStatus.NOT_FOUND)
    }
  }

  async deleteAllByFacultyId(facultyId: Types.ObjectId) {
    const groups = await this.groupModel.find({ faculty: facultyId }).exec()
    const groupsIds: Types.ObjectId[] = groups.map(group => group.id)

    await this.responsibleService.deleteGroupsFromAllResponsibles(groupsIds)
    return this.groupModel.deleteMany({ faculty: facultyId }).exec()
  }

  async update(dto: UpdateGroupDto) {
    const candidate = await this.groupModel
      .findByIdAndUpdate(dto.id, {
        $set: { title: dto.title, faculty: dto.faculty },
      })
      .exec()

    if (!candidate) {
      throw new HttpException(GROUP_WITH_ID_NOT_FOUND(dto.id), HttpStatus.NOT_FOUND)
    }

    return this.groupModel.findById(dto.id).exec()
  }

  async checkExists(
    filter:
      | ObjectByInterface<typeof GroupFieldsEnum, ModelBase>
      | ObjectByInterface<typeof GroupFieldsEnum, ModelBase>[],
    errorMessage: {
      message: ((args?: any) => string) | string
      type: HttpStatus
      key?: keyof ObjectByInterface<typeof GroupFieldsEnum, ModelBase>
    }
  ) {
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.groupModel.exists(f)

        if (!candidate) {
          throw new HttpException(
            typeof errorMessage.message === 'string'
              ? errorMessage.message
              : errorMessage.message(errorMessage.key ? f[errorMessage.key] : undefined),
            errorMessage.type
          )
        }
      }
    } else {
      if (!(await this.groupModel.exists(filter))) {
        throw new HttpException(
          typeof errorMessage.message === 'string'
            ? errorMessage.message
            : errorMessage.message(errorMessage.key ? filter[errorMessage.key] : undefined),
          errorMessage.type
        )
      }
    }

    return true
  }
}
