import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { CreateFacultyDto } from './dto/createFaculty.dto'
import { InjectModel } from 'nestjs-typegoose'
import { FacultyModel } from './faculty.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { FacultyField, FacultyFieldsEnum } from './faculty.constants'
import { Error, Types } from 'mongoose'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { FACULTY_WITH_ID_NOT_FOUND, FACULTY_WITH_TITLE_EXISTS } from '../../global/constants/errors.constants'
import { ModelBase, MongoIdString, ObjectByInterface } from '../../global/types'
import { stringToObjectId } from '../../global/utils/stringToObjectId'

@Injectable()
export class FacultyService {
  constructor(@InjectModel(FacultyModel) private readonly facultyModel: ModelType<FacultyModel>) {}

  async create(dto: CreateFacultyDto) {
    await this.checkExists({ title: dto.title }, new HttpException(FACULTY_WITH_TITLE_EXISTS(dto.title), HttpStatus.BAD_REQUEST))

    return this.facultyModel.create(dto)
  }

  async getById(facultyId: MongoIdString | Types.ObjectId, fields?: FacultyField[]) {
    facultyId = stringToObjectId(facultyId)
    const candidate = await this.facultyModel.findById(facultyId, fieldsArrayToProjection(fields)).exec()

    if (!candidate) {
      throw new HttpException(FACULTY_WITH_ID_NOT_FOUND(facultyId), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  getAll(page: number, count: number, title?: string, fields?: FacultyField[]) {
    return this.facultyModel
      .find(title ? { title: { $regex: title, $options: 'i' } } : {}, fieldsArrayToProjection(fields))
      .skip((page - 1) * count)
      .limit(count)
      .exec()
  }

  countAll(title?: string) {
    return this.facultyModel.countDocuments(title ? { title: { $regex: title, $options: 'i' } } : {}).exec()
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

  async delete(id: Types.ObjectId) {
    await this.checkExists({ _id: id })
    await this.facultyModel.deleteOne({ _id: id }).exec()
  }

  async checkExists(
    filter: ObjectByInterface<typeof FacultyFieldsEnum, ModelBase> | ObjectByInterface<typeof FacultyFieldsEnum, ModelBase>[],
    error: ((filter: ObjectByInterface<typeof FacultyFieldsEnum, ModelBase>) => Error) | Error = f =>
      new NotFoundException(FACULTY_WITH_ID_NOT_FOUND(f._id))
  ) {
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.facultyModel.exists(f)

        if (!candidate) {
          if (error instanceof Error) throw Error
          throw error(f)
        }
      }
    } else {
      if (!(await this.facultyModel.exists(filter))) {
        if (error instanceof Error) throw error
        throw error(filter)
      }
    }

    return true
  }
}
