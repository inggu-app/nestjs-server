import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CreateFacultyDto } from './dto/createFaculty.dto'
import { InjectModel } from 'nestjs-typegoose'
import { FacultyModel } from './faculty.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { FilterQuery, QueryOptions, Types } from 'mongoose'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import { FACULTY_WITH_ID_NOT_FOUND, FACULTY_WITH_TITLE_EXISTS } from '../../global/constants/errors.constants'
import { DocumentType } from '@typegoose/typegoose'
import { CheckExistenceService } from '../../global/classes/CheckExistenceService'
import { GroupService } from '../group/services/group.service'
import { facultyServiceMethodDefaultOptions } from './faculty.constants'
import { mergeOptionsWithDefaultOptions } from '../../global/utils/serviceMethodOptions'
import { UserService } from '../user/services/user.service'

@Injectable()
export class FacultyService extends CheckExistenceService<FacultyModel> {
  constructor(
    @InjectModel(FacultyModel) private readonly facultyModel: ModelType<FacultyModel>,
    @Inject(forwardRef(() => GroupService)) private readonly groupService: GroupService,
    private readonly userService: UserService
  ) {
    super(facultyModel, undefined, arg => FACULTY_WITH_ID_NOT_FOUND(arg._id))
  }

  async create(dto: CreateFacultyDto, options = facultyServiceMethodDefaultOptions.create) {
    options = mergeOptionsWithDefaultOptions(options, facultyServiceMethodDefaultOptions.create)
    if (options.checkExistence.faculty) await this.throwIfExists({ title: dto.title }, { error: FACULTY_WITH_TITLE_EXISTS(dto.title) })
    return this.facultyModel.create(dto)
  }

  async getById(facultyId: Types.ObjectId, queryOptions?: QueryOptions, options = facultyServiceMethodDefaultOptions.getById) {
    options = mergeOptionsWithDefaultOptions(options, facultyServiceMethodDefaultOptions.getById)
    if (options.checkExistence.faculty) await this.throwIfNotExists({ _id: facultyId })
    return (await this.facultyModel.findById(facultyId, undefined, queryOptions).exec()) as unknown as DocumentType<FacultyModel>
  }

  async getByIds(facultyIds: Types.ObjectId[], queryOptions?: QueryOptions, options = facultyServiceMethodDefaultOptions.getByIds) {
    options = mergeOptionsWithDefaultOptions(options, facultyServiceMethodDefaultOptions.getByIds)
    if (options.checkExistence.faculty) await this.throwIfNotExists(facultyIds.map(id => ({ _id: id })))
    return this.facultyModel.find({ _id: { $in: facultyIds } }, undefined, queryOptions)
  }

  getMany(page: number, count: number, title?: string, queryOptions?: QueryOptions, in_?: Types.ObjectId[]) {
    const filter: FilterQuery<DocumentType<FacultyModel>> = {}
    if (title) filter.title = { $regex: title, $options: 'i' }
    if (in_) filter._id = { $in: in_ }

    return this.facultyModel
      .find(filter, undefined, queryOptions)
      .skip((page - 1) * count)
      .limit(count)
  }

  countMany(title?: string, in_?: Types.ObjectId[]) {
    const filter: FilterQuery<DocumentType<FacultyModel>> = {}
    if (title) filter.title = { $regex: title, $options: 'i' }
    if (in_) filter._id = { $in: in_ }

    return this.facultyModel.countDocuments(filter)
  }

  async update(dto: UpdateFacultyDto, options = facultyServiceMethodDefaultOptions.update) {
    options = mergeOptionsWithDefaultOptions(options, facultyServiceMethodDefaultOptions.update)
    const { id, ...fields } = dto
    if (options.checkExistence.faculty) await this.throwIfNotExists({ _id: dto.id })
    return this.facultyModel.updateOne({ _id: id }, { $set: fields })
  }

  async delete(id: Types.ObjectId, options = facultyServiceMethodDefaultOptions.delete) {
    options = mergeOptionsWithDefaultOptions(options, facultyServiceMethodDefaultOptions.delete)
    if (options.checkExistence.faculty) await this.throwIfNotExists({ _id: id })
    await this.groupService.deleteAllByFacultyId(id, { checkExistence: { faculty: false } })
    await this.userService.clearFrom(id, FacultyModel)
    return this.facultyModel.deleteOne({ _id: id })
  }

  clearFrom(ids: Types.ObjectId | Types.ObjectId[]) {
    if (!Array.isArray(ids)) ids = [ids]
    return this.facultyModel.updateMany({ callSchedule: { $in: ids } }, { $set: { callSchedule: null } })
  }
}
