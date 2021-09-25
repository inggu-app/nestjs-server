import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateCallScheduleDto } from './dto/createCallSchedule.dto'
import { CALL_SCHEDULE_TYPE } from '../settings.constants'
import { CallScheduleModel } from './callSchedule.model'

@Injectable()
export class CallScheduleService {
  constructor(
    @InjectModel(CallScheduleModel) private readonly callScheduleModel: ModelType<CallScheduleModel>
  ) {}

  getActiveCallSchedule() {
    return this.callScheduleModel.findOne(
      { isActive: true, settingType: CALL_SCHEDULE_TYPE },
      { schedule: 1, updatedAt: 1, _id: 0 }
    )
  }

  createCallSchedule(dto: CreateCallScheduleDto) {
    return this.callScheduleModel.create({
      settingType: CALL_SCHEDULE_TYPE,
      schedule: dto.schedule,
    })
  }

  deleteActiveCallSchedule() {
    return this.callScheduleModel.deleteOne({ isActive: true, settingType: CALL_SCHEDULE_TYPE })
  }
}
