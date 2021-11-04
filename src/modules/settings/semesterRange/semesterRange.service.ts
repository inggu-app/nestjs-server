import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { SemesterRangeModel } from './semesterRange.model'
import { SEMESTER_RANGE_TYPE } from '../settings.constants'
import { CreateSemesterRangeDto } from './dto/createSemesterRange.dto'

@Injectable()
export class SemesterRangeService {
  constructor(
    @InjectModel(SemesterRangeModel)
    private readonly semesterStartDateModel: ModelType<SemesterRangeModel>
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

  createSemesterStartDate(dto: CreateSemesterRangeDto) {
    return this.semesterStartDateModel.create({
      startDate: dto.startDate,
      endDate: dto.endDate,
      settingType: SEMESTER_RANGE_TYPE,
      isActive: true,
    })
  }
}
