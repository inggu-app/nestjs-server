import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateFacultyDto } from './dto/create-faculty.dto'
import { InjectModel } from 'nestjs-typegoose'
import { FacultyModel } from './faculty.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { FACULTY_EXISTS, FACULTY_NOT_FOUND } from './faculty.constants'
import { Types } from 'mongoose'
import { INCORRECT_PAGE_COUNT_QUERIES } from '../../global/constants/errors.constants'

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

  getById(facultyId: Types.ObjectId) {
    return this.facultyModel.findById(facultyId)
  }

  getAll(page: number, count: number, title: string) {
    if (page === -1 && count === -1) {
      return this.facultyModel.find({ title: { $regex: title, $options: 'i' } })
    } else if (page === -1 || count === -1) {
      throw new HttpException(INCORRECT_PAGE_COUNT_QUERIES, HttpStatus.BAD_REQUEST)
    } else {
      return this.facultyModel
        .find({ title: { $regex: title, $options: 'i' } })
        .skip((page - 1) * count)
        .limit(count)
    }
  }

  countAll(title: string) {
    return this.facultyModel.countDocuments({ title: { $regex: title, $options: 'i' } })
  }

  getAllForDropdown() {
    return this.facultyModel.find({}, { title: 1 })
  }

  async delete(facultyId: Types.ObjectId) {
    const deletedDoc = await this.facultyModel.findByIdAndDelete(facultyId)

    if (!deletedDoc) {
      throw new HttpException(FACULTY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
  }
}
