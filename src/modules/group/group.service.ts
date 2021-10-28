import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GroupModel } from './group.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { DocumentType } from '@typegoose/typegoose'
import { CreateGroupDto } from './dto/createGroup.dto'
import { Error, FilterQuery, Types } from 'mongoose'
import {
  GroupField,
  GroupFieldsEnum,
  GroupGetByFacultyIdDataForFunctionality,
  GroupGetByGroupIdsDataForFunctionality,
  GroupGetManyDataForFunctionality,
} from './group.constants'
import { ResponsibleService } from '../responsible/responsible.service'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { FacultyService } from '../faculty/faculty.service'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { GROUP_WITH_ID_NOT_FOUND, GROUP_WITH_TITLE_EXISTS } from '../../global/constants/errors.constants'
import { ModelBase, MongoIdString, ObjectByInterface, ServiceGetOptions } from '../../global/types'
import { stringToObjectId } from '../../global/utils/stringToObjectId'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'

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

  async getById(groupId: MongoIdString | Types.ObjectId, options?: ServiceGetOptions<GroupField>) {
    groupId = stringToObjectId(groupId)

    const candidate = await this.groupModel
      .findById(groupId, Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields, options?.queryOptions)
      .exec()

    if (!candidate) {
      throw new HttpException(GROUP_WITH_ID_NOT_FOUND(groupId), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async getByGroupIds(
    groupIds: MongoIdString[] | Types.ObjectId[],
    options?: ServiceGetOptions<GroupField, GroupGetByGroupIdsDataForFunctionality>
  ) {
    groupIds = groupIds.map(stringToObjectId)
    await this.checkExists(groupIds.map(id => ({ _id: id })))
    const filter: FilterQuery<DocumentType<GroupModel>> = { _id: { $in: groupIds } }
    if (options?.functionality) {
      filter._id = { $in: groupIds, $nin: options.functionality.data.forbiddenGroups }
      filter.faculty = { $nin: options.functionality.data.forbiddenFaculties }
      if (options.functionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.CUSTOM) {
        filter._id = {
          $in: groupIds.filter(id => options.functionality?.data.availableGroups.includes(id.toString())),
          $nin: options.functionality.data.forbiddenGroups,
        }
        filter.faculty = { $in: options.functionality.data.availableFaculties, $nin: options.functionality.data.forbiddenFaculties }
      }
    }

    return this.groupModel.find(
      filter,
      Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields,
      options?.queryOptions
    )
  }

  getAll(page: number, count: number, title?: string, options?: ServiceGetOptions<GroupField, GroupGetManyDataForFunctionality>) {
    const filter: FilterQuery<DocumentType<GroupModel>> = {}
    if (title) filter.title = { $regex: title, $options: 'i' }
    if (options?.functionality) {
      filter._id = { $nin: options.functionality.data.forbiddenGroups }
      filter.faculty = { $nin: options.functionality.data.forbiddenFaculties }
      if (options.functionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.CUSTOM) {
        filter._id = { $in: options.functionality.data.availableGroups, $nin: options.functionality.data.forbiddenGroups }
        filter.faculty = { $in: options.functionality.data.availableFaculties, $nin: options.functionality.data.forbiddenFaculties }
      }
    }
    return this.groupModel
      .find(filter, Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields, options?.queryOptions)
      .skip((page - 1) * count)
      .limit(count)
      .exec()
  }

  countAll(title?: string, options?: ServiceGetOptions<GroupField, GroupGetManyDataForFunctionality>) {
    const filter: FilterQuery<DocumentType<GroupModel>> = {}
    if (title) filter.title = { $regex: title, $options: 'i' }
    if (options?.functionality) {
      filter._id = { $nin: options.functionality.data.forbiddenGroups }
      filter.faculty = { $nin: options.functionality.data.forbiddenFaculties }
      if (options.functionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.CUSTOM) {
        filter._id = { $in: options.functionality.data.availableGroups, $nin: options.functionality.data.forbiddenGroups }
        filter.faculty = { $in: options.functionality.data.availableFaculties, $nin: options.functionality.data.forbiddenFaculties }
      }
    }
    return this.groupModel.countDocuments(filter).exec()
  }

  async getByFacultyId(
    facultyId: Types.ObjectId | MongoIdString,
    options?: ServiceGetOptions<GroupField, GroupGetByFacultyIdDataForFunctionality>
  ) {
    facultyId = stringToObjectId(facultyId)
    await this.facultyService.checkExists({ _id: facultyId })
    const filter: FilterQuery<DocumentType<GroupModel>> = { faculty: facultyId }
    if (options?.functionality) {
      filter._id = { $nin: options.functionality.data.forbiddenGroups }
      if (options?.functionality.data.availableFacultiesType === FunctionalityAvailableTypeEnum.CUSTOM) {
        filter._id = { $in: options.functionality.data.availableGroups, $nin: options.functionality.data.forbiddenGroups }
      }
    }

    return this.groupModel
      .find(filter, Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields, options?.queryOptions)
      .exec()
  }

  async delete(id: Types.ObjectId | MongoIdString) {
    id = stringToObjectId(id)
    await this.checkExists({ _id: id })
    await this.groupModel.deleteOne({ _id: id }).exec()
    await this.responsibleService.deleteGroupsFromAllResponsibles([id])
  }

  async deleteAllByFacultyId(facultyId: Types.ObjectId | MongoIdString) {
    facultyId = stringToObjectId(facultyId)
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
          throw error
        } else if (candidate && !checkExisting) {
          if (typeof error === 'function') throw error(f)
          throw error
        }
      }
    } else {
      const candidate = await this.groupModel.exists(filter)
      if (!candidate && checkExisting) {
        if (typeof error === 'function') throw error(filter)
        throw error
      } else if (candidate && !checkExisting) {
        if (typeof error === 'function') throw error(filter)
        throw error
      }
    }

    return true
  }
}
