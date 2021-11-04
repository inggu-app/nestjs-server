import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { SemesterRangeDateModel } from './semesterRangeDate.model'
import { SEMESTER_RANGE_TYPE } from '../settings.constants'
import { CreateSemesterStartDateDto } from './dto/createSemesterStartDate.dto'

@Injectable()
export class SemesterRangeDateService {
  constructor(
    @InjectModel(SemesterRangeDateModel)
    private readonly semesterStartDateModel: ModelType<SemesterRangeDateModel>
  ) {}

  getActiveSemesterStartDate() {
    return this.semesterStartDateModel.findOne(
      {
        isActive: true,
        settingType: SEMESTER_RANGE_TYPE,
      },
      { startDate: 1, endDate: 1, updatedAt: 1, _id: 0 }
    )
  }

  deleteActiveSemesterStartDate() {
    return this.semesterStartDateModel.deleteOne({
      isActive: true,
      settingType: SEMESTER_RANGE_TYPE,
    })
  }

  createSemesterStartDate(dto: CreateSemesterStartDateDto) {
    return this.semesterStartDateModel.create({
      startDate: dto.startDate,
      endDate: dto.endDate,
      settingType: SEMESTER_RANGE_TYPE,
      isActive: true,
    })
  }
}
