import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateFacultyDto } from './dto/create-faculty.dto'
import { InjectModel } from 'nestjs-typegoose'
import { FacultyModel } from './faculty.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { FacultyField } from './faculty.constants'
import { Types } from 'mongoose'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import {
  FACULTY_WITH_ID_NOT_FOUND,
  FACULTY_WITH_TITLE_EXISTS,
} from '../../global/constants/errors.constants'

@Injectable()
export class FacultyService {
  constructor(@InjectModel(FacultyModel) private readonly facultyModel: ModelType<FacultyModel>) {}

  async create(dto: CreateFacultyDto) {
    const candidate = await this.facultyModel.findOne({ title: dto.title }).exec()

    if (candidate) {
      throw new HttpException(FACULTY_WITH_TITLE_EXISTS(dto.title), HttpStatus.BAD_REQUEST)
    }

    return this.facultyModel.create(dto)
  }

  async getById(facultyId: Types.ObjectId, fields?: FacultyField[]) {
    const candidate = await this.facultyModel
      .findById(facultyId, fieldsArrayToProjection(fields))
      .exec()

    if (!candidate) {
      throw new HttpException(FACULTY_WITH_ID_NOT_FOUND(facultyId), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  getAll(page: number, count: number, title?: string, fields?: FacultyField[]) {
    return this.facultyModel
      .find(
        title ? { title: { $regex: title, $options: 'i' } } : {},
        fieldsArrayToProjection(fields)
      )
      .skip((page - 1) * count)
      .limit(count)
      .exec()
  }

  countAll(title?: string) {
    return this.facultyModel
      .countDocuments(title ? { title: { $regex: title, $options: 'i' } } : {})
      .exec()
  }

  async update(dto: UpdateFacultyDto) {
    const candidate = await this.facultyModel
      .findByIdAndUpdate(dto.id, {
        $set: { title: dto.title },
      })
      .exec()

    if (!candidate) {
      throw new HttpException(FACULTY_WITH_ID_NOT_FOUND(dto.id), HttpStatus.NOT_FOUND)
    }

    return this.facultyModel.findById(dto.id).exec()
  }

  async delete(facultyId: Types.ObjectId) {
    const deletedDoc = await this.facultyModel.findByIdAndDelete(facultyId).exec()

    if (!deletedDoc) {
      throw new HttpException(FACULTY_WITH_ID_NOT_FOUND(facultyId), HttpStatus.NOT_FOUND)
    }
  }
}
