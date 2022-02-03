import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateFacultyDto } from './dto/createFaculty.dto'
import { InjectModel } from 'nestjs-typegoose'
import { FacultyModel } from './faculty.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { FacultyFieldsEnum } from './faculty.constants'
import { Error, FilterQuery, QueryOptions, Types } from 'mongoose'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import { FACULTY_WITH_ID_NOT_FOUND, FACULTY_WITH_TITLE_EXISTS } from '../../global/constants/errors.constants'
import { ModelBase, MongoIdString, ObjectByInterface } from '../../global/types'
import { stringToObjectId } from '../../global/utils/stringToObjectId'
import { DocumentType } from '@typegoose/typegoose'

@Injectable()
export class FacultyService {
  constructor(@InjectModel(FacultyModel) private readonly facultyModel: ModelType<FacultyModel>) {}

  async create(dto: CreateFacultyDto) {
    await this.checkExists(
      { title: dto.title },
      { error: new HttpException(FACULTY_WITH_TITLE_EXISTS(dto.title), HttpStatus.BAD_REQUEST), checkExisting: false }
    )

    return this.facultyModel.create(dto)
  }

  async getById(facultyId: MongoIdString | Types.ObjectId, queryOptions?: QueryOptions) {
    facultyId = stringToObjectId(facultyId)
    const candidate = await this.facultyModel.findById(facultyId, undefined, queryOptions).exec()

    if (!candidate) {
      throw new HttpException(FACULTY_WITH_ID_NOT_FOUND(facultyId), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async getByIds(facultyIds: Types.ObjectId[] | MongoIdString[], queryOptions?: QueryOptions) {
    facultyIds = facultyIds.map(stringToObjectId)
    await this.checkExists(facultyIds.map(id => ({ _id: id })))

    return this.facultyModel.find({ _id: { $in: facultyIds } }, undefined, queryOptions)
  }

  getAll(page: number, count: number, title?: string, queryOptions?: QueryOptions) {
    const filter: FilterQuery<DocumentType<FacultyModel>> = {}
    if (title) filter.title = { $regex: title, $options: 'i' }

    return this.facultyModel
      .find(filter, undefined, queryOptions)
      .skip((page - 1) * count)
      .limit(count)
      .exec()
  }

  countAll(title?: string) {
    const filter: FilterQuery<DocumentType<FacultyModel>> = {}
    if (title) filter.title = { $regex: title, $options: 'i' }

    return this.facultyModel.countDocuments(filter).exec()
  }

  async update(dto: UpdateFacultyDto) {
    await this.checkExists({ _id: dto.id })
    await this.facultyModel
      .updateOne(
        { _id: dto.id },
        {
          $set: { title: dto.title },
        }
      )
      .exec()

    return this.facultyModel.findById(dto.id).exec()
  }

  async delete(id: Types.ObjectId | MongoIdString) {
    id = stringToObjectId(id)
    await this.checkExists({ _id: id })
    await this.facultyModel.deleteOne({ _id: id }).exec()
    return
  }

  async checkExists(
    filter: ObjectByInterface<typeof FacultyFieldsEnum, ModelBase> | ObjectByInterface<typeof FacultyFieldsEnum, ModelBase>[],
    options?: { error?: ((filter: ObjectByInterface<typeof FacultyFieldsEnum, ModelBase>) => Error) | Error; checkExisting?: boolean }
  ) {
    options = {
      error: f => new NotFoundException(FACULTY_WITH_ID_NOT_FOUND(f._id)),
      checkExisting: true,
      ...options,
    }
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.facultyModel.exists(f)

        if (!candidate && options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        } else if (candidate && !options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        }
      }
    } else {
      const candidate = await this.facultyModel.exists(filter)

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
