import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { WeeksCountModel } from './weeksCount.model'
import { WEEKS_COUNT_TYPE } from '../settings.constants'
import { CreateWeeksCountDto } from './dto/createWeeksCount.dto'

@Injectable()
export class WeeksCountService {
  constructor(@InjectModel(WeeksCountModel) private readonly weeksCountModel: ModelType<WeeksCountModel>) {}

  getActiveWeeksCount() {
    return this.weeksCountModel.findOne(
      {
        isActive: true,
        settingType: WEEKS_COUNT_TYPE,
      },
      { count: 1, updatedAt: 1, _id: 0 }
    )
  }

  deleteActiveWeeksCount() {
    return this.weeksCountModel.deleteOne({
      isActive: true,
      settingType: WEEKS_COUNT_TYPE,
    })
  }

  createWeeksCount(dto: CreateWeeksCountDto) {
    return this.weeksCountModel.create({
      count: dto.count,
      settingType: WEEKS_COUNT_TYPE,
      isActive: true,
    })
  }
}
