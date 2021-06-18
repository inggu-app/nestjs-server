import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { WeeksCountModel } from './weeksCount.model'
import { WEEKS_COUNT_TYPE } from '../settings.constants'
import { CreateWeeksCountDto } from './dto/createWeeksCount.dto'

@Injectable()
export class WeeksCountService {
  constructor(
    @InjectModel(WeeksCountModel) private readonly weeksCountModel: ModelType<WeeksCountModel>
  ) {}

  async getActiveWeeksCount() {
    const weeksCountDoc = await this.weeksCountModel.findOne({
      isActive: true,
      settingType: WEEKS_COUNT_TYPE,
    })

    return weeksCountDoc?.count
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
