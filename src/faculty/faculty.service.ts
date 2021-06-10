import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateFacultyDto } from './dto/create-faculty.dto'
import { InjectModel } from 'nestjs-typegoose'
import { FacultyModel } from './faculty.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { FACULTY_EXISTS } from './faculty.constants'

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

  getAllForDropdown() {
    return this.facultyModel.find({}, { title: 1 })
  }
}
