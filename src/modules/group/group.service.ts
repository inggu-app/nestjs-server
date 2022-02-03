import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GroupModel } from './group.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { DocumentType } from '@typegoose/typegoose'
import { CreateGroupDto } from './dto/createGroup.dto'
import { Error, FilterQuery, QueryOptions, Types } from 'mongoose'
import { GroupFieldsEnum } from './group.constants'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { FacultyService } from '../faculty/faculty.service'
import { GROUP_WITH_ID_NOT_FOUND, GROUP_WITH_TITLE_EXISTS } from '../../global/constants/errors.constants'
import { ModelBase, MongoIdString, ObjectByInterface } from '../../global/types'
import { stringToObjectId } from '../../global/utils/stringToObjectId'

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(GroupModel) private readonly groupModel: ModelType<GroupModel>,
    private readonly facultyService: FacultyService
  ) {}

  async create(dto: CreateGroupDto) {
    await this.checkExists(
      { title: dto.title, faculty: dto.faculty },
      { error: new HttpException(GROUP_WITH_TITLE_EXISTS(dto.title), HttpStatus.BAD_REQUEST), checkExisting: false }
    )

    return this.groupModel.create(dto)
  }

  async getById(groupId: MongoIdString | Types.ObjectId, queryOptions?: QueryOptions) {
    groupId = stringToObjectId(groupId)

    const candidate = await this.groupModel.findById(groupId, undefined, queryOptions).exec()

    if (!candidate) {
      throw new HttpException(GROUP_WITH_ID_NOT_FOUND(groupId), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async getByGroupIds(groupIds: MongoIdString[] | Types.ObjectId[], queryOptions?: QueryOptions) {
    groupIds = groupIds.map(stringToObjectId)
    await this.checkExists(groupIds.map(id => ({ _id: id })))
    const filter: FilterQuery<DocumentType<GroupModel>> = { _id: { $in: groupIds } }

    return this.groupModel.find(filter, undefined, queryOptions)
  }

  getAll(page: number, count: number, title?: string, queryOptions?: QueryOptions) {
    const filter: FilterQuery<DocumentType<GroupModel>> = {}
    if (title) filter.title = { $regex: title, $options: 'i' }

    return this.groupModel
      .find(filter, undefined, queryOptions)
      .skip((page - 1) * count)
      .limit(count)
      .exec()
  }

  countAll(title?: string) {
    const filter: FilterQuery<DocumentType<GroupModel>> = {}
    if (title) filter.title = { $regex: title, $options: 'i' }

    return this.groupModel.countDocuments(filter).exec()
  }

  async getByFacultyId(facultyId: Types.ObjectId | MongoIdString, queryOptions?: QueryOptions) {
    facultyId = stringToObjectId(facultyId)
    await this.facultyService.checkExists({ _id: facultyId })
    const filter: FilterQuery<DocumentType<GroupModel>> = { faculty: facultyId }

    return this.groupModel.find(filter, undefined, queryOptions).exec()
  }

  async delete(id: Types.ObjectId | MongoIdString) {
    id = stringToObjectId(id)
    await this.checkExists({ _id: id })
    await this.groupModel.deleteOne({ _id: id })
    return
  }

  async deleteAllByFacultyId(facultyId: Types.ObjectId | MongoIdString) {
    facultyId = stringToObjectId(facultyId)

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
    options?: { error?: ((filter: ObjectByInterface<typeof GroupFieldsEnum, ModelBase>) => Error) | Error; checkExisting?: boolean }
  ) {
    options = {
      error: f => new NotFoundException(GROUP_WITH_ID_NOT_FOUND(f._id)),
      checkExisting: true,
      ...options,
    }
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.groupModel.exists(f)

        if (!candidate && options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        } else if (candidate && !options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        }
      }
    } else {
      const candidate = await this.groupModel.exists(filter)
      if (!candidate && options.checkExisting) {
        if (typeof options.error === 'function') throw options.error(filter)
        throw options.error
      } else if (candidate && !options.checkExisting) {
        if (typeof options.error === 'function') throw options.error(filter)
        throw options.error
      }
    }

    return true
  }
}
