import { Injectable } from '@nestjs/common'
import { CreateFacultyDto } from './dto/createFaculty.dto'
import { InjectModel } from 'nestjs-typegoose'
import { FacultyModel } from './faculty.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { FilterQuery, QueryOptions, Types } from 'mongoose'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import { FACULTY_WITH_ID_NOT_FOUND, FACULTY_WITH_TITLE_EXISTS } from '../../global/constants/errors.constants'
import { DocumentType } from '@typegoose/typegoose'
import { CheckExistenceService } from '../../global/classes/CheckExistenceService'

@Injectable()
export class FacultyService extends CheckExistenceService<FacultyModel> {
  constructor(@InjectModel(FacultyModel) private readonly facultyModel: ModelType<FacultyModel>) {
    super(facultyModel, undefined, arg => FACULTY_WITH_ID_NOT_FOUND(arg._id))
  }

  async create(dto: CreateFacultyDto) {
    await this.throwIfExists({ title: dto.title }, { error: FACULTY_WITH_TITLE_EXISTS(dto.title) })
    return this.facultyModel.create(dto)
  }

  async getById(facultyId: Types.ObjectId, queryOptions?: QueryOptions) {
    await this.throwIfNotExists({ _id: facultyId })
    return this.facultyModel.findById(facultyId, undefined, queryOptions).exec()
  }

  async getByIds(facultyIds: Types.ObjectId[], queryOptions?: QueryOptions) {
    await this.throwIfNotExists(facultyIds.map(id => ({ _id: id })))
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
    await this.throwIfNotExists({ _id: Types.ObjectId(dto.id) })
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

  async delete(id: Types.ObjectId) {
    await this.throwIfNotExists({ _id: id })
    await this.facultyModel.deleteOne({ _id: id }).exec()
    return
  }
}
