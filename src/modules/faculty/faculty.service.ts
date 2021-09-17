import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateFacultyDto } from './dto/create-faculty.dto'
import { InjectModel } from 'nestjs-typegoose'
import { FacultyModel } from './faculty.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { FACULTY_EXISTS, FACULTY_NOT_FOUND, FacultyField } from './faculty.constants'
import { Types } from 'mongoose'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import checkPageCount from '../../global/utils/checkPageCount'

@Injectable()
export class FacultyService {
  constructor(@InjectModel(FacultyModel) private readonly facultyModel: ModelType<FacultyModel>) {}

  async create(dto: CreateFacultyDto) {
    const candidate = await this.facultyModel.findOne({ title: dto.title })

    if (candidate) {
      throw new HttpException(FACULTY_EXISTS, HttpStatus.BAD_REQUEST)
    }

    return this.facultyModel.create(dto)
  }

  async getById(facultyId: Types.ObjectId, fields?: FacultyField[]) {
    const candidate = this.facultyModel.findById(facultyId, fieldsArrayToProjection(fields))

    if (!candidate) {
      throw new HttpException(FACULTY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  async getAll(page?: number, count?: number, title?: string) {
    const checkedPageCount = checkPageCount(page, count)

    const faculties = this.facultyModel.find(
      title ? { title: { $regex: title, $options: 'i' } } : {}
    )

    if (checkedPageCount.page !== undefined) {
      return faculties
        .skip((checkedPageCount.page - 1) * checkedPageCount.count)
        .limit(checkedPageCount.count)
    }

    return faculties
  }

  countAll(title?: string) {
    return this.facultyModel.countDocuments(
      title ? { title: { $regex: title, $options: 'i' } } : {}
    )
  }

  async update(dto: UpdateFacultyDto) {
    const candidate = await this.facultyModel.findByIdAndUpdate(dto.id, {
      $set: { title: dto.title },
    })

    if (!candidate) {
      throw new HttpException(FACULTY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.facultyModel.findById(dto.id)
  }

  async delete(facultyId: Types.ObjectId) {
    const deletedDoc = await this.facultyModel.findByIdAndDelete(facultyId)

    if (!deletedDoc) {
      throw new HttpException(FACULTY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
  }
}
