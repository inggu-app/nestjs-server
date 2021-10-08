import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GroupModel } from './group.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateGroupDto } from './dto/createGroup.dto'
import { Error, Types } from 'mongoose'
import { GroupField, GroupFieldsEnum } from './group.constants'
import { ResponsibleService } from '../responsible/responsible.service'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { FacultyService } from '../faculty/faculty.service'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { GROUP_WITH_ID_NOT_FOUND, GROUP_WITH_TITLE_EXISTS } from '../../global/constants/errors.constants'
import { ModelBase, MongoIdString, ObjectByInterface } from '../../global/types'
import { stringToObjectId } from '../../global/utils/stringToObjectId'

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(GroupModel) private readonly groupModel: ModelType<GroupModel>,
    @Inject(forwardRef(() => ResponsibleService))
    private readonly responsibleService: ResponsibleService,
    private readonly facultyService: FacultyService
  ) {}

  async create(dto: CreateGroupDto) {
    await this.checkExists(
      { title: dto.title, faculty: dto.faculty },
      new HttpException(GROUP_WITH_TITLE_EXISTS(dto.title), HttpStatus.BAD_REQUEST),
      false
    )

    return this.groupModel.create(dto)
  }

  async getById(groupId: MongoIdString | Types.ObjectId, fields?: GroupField[]) {
    groupId = stringToObjectId(groupId)

    const candidate = await this.groupModel.findById(groupId, fieldsArrayToProjection(fields)).exec()

    if (!candidate) {
      throw new HttpException(GROUP_WITH_ID_NOT_FOUND(groupId), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  getAll(page: number, count: number, title?: string, fields?: GroupField[]) {
    return this.groupModel
      .find(title ? { title: { $regex: title, $options: 'i' } } : {}, fieldsArrayToProjection(fields))
      .skip((page - 1) * count)
      .limit(count)
      .exec()
  }

  countAll(title?: string) {
    return this.groupModel.countDocuments(title ? { title: { $regex: title, $options: 'i' } } : {}).exec()
  }

  async getByFacultyId(facultyId: Types.ObjectId, fields?: GroupField[]) {
    await this.facultyService.checkExists({ _id: facultyId })

    return this.groupModel.find({ faculty: facultyId }, fieldsArrayToProjection(fields)).exec()
  }

  async delete(id: Types.ObjectId) {
    await this.checkExists({ _id: id })
    await this.groupModel.deleteOne({ _id: id }).exec()
    await this.responsibleService.deleteGroupsFromAllResponsibles([id])
  }

  async deleteAllByFacultyId(facultyId: Types.ObjectId) {
    const groups = await this.groupModel.find({ faculty: facultyId }).exec()
    const groupsIds: Types.ObjectId[] = groups.map(group => group.id)

    await this.responsibleService.deleteGroupsFromAllResponsibles(groupsIds)
    return this.groupModel.deleteMany({ faculty: facultyId }).exec()
  }

  async update(dto: UpdateGroupDto) {
    await this.checkExists({ _id: dto.id })

    await this.groupModel
      .updateOne(
        { _id: dto.id },
        {
          $set: { title: dto.title, faculty: dto.faculty },
        }
      )
      .exec()

    return this.groupModel.findById(dto.id).exec()
  }

  async checkExists(
    filter: ObjectByInterface<typeof GroupFieldsEnum, ModelBase> | ObjectByInterface<typeof GroupFieldsEnum, ModelBase>[],
    error: ((filter: ObjectByInterface<typeof GroupFieldsEnum, ModelBase>) => Error) | Error = f =>
      new NotFoundException(GROUP_WITH_ID_NOT_FOUND(f._id)),
    checkExisting = true
  ) {
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.groupModel.exists(f)

        if (!candidate && checkExisting) {
          if (typeof error === 'function') throw error(f)
          throw Error
        } else if (candidate && !checkExisting) {
          if (typeof error === 'function') throw error(f)
          throw Error
        }
      }
    } else {
      const candidate = await this.groupModel.exists(filter)
      if (!candidate && checkExisting) {
        if (typeof error === 'function') throw error(filter)
        throw Error
      } else if (candidate && !checkExisting) {
        if (typeof error === 'function') throw error(filter)
        throw error
      }
    }

    return true
  }
}
