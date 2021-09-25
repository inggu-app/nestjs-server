import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { SemesterStartDateModel } from './semesterStartDate.model'
import { SEMESTER_START_TIME_TYPE } from '../settings.constants'
import { CreateSemesterStartDateDto } from './dto/createSemesterStartDate.dto'

@Injectable()
export class SemesterStartDateService {
  constructor(
    @InjectModel(SemesterStartDateModel)
    private readonly semesterStartDateModel: ModelType<SemesterStartDateModel>
  ) {}

  getActiveSemesterStartDate() {
    return this.semesterStartDateModel.findOne(
      {
        isActive: true,
        settingType: SEMESTER_START_TIME_TYPE,
      },
      { date: 1, updatedAt: 1, _id: 0 }
    )
  }

  deleteActiveSemesterStartDate() {
    return this.semesterStartDateModel.deleteOne({
      isActive: true,
      settingType: SEMESTER_START_TIME_TYPE,
    })
  }

  createSemesterStartDate(dto: CreateSemesterStartDateDto) {
    return this.semesterStartDateModel.create({
      date: dto.date,
      settingType: SEMESTER_START_TIME_TYPE,
      isActive: true,
    })
  }
}
