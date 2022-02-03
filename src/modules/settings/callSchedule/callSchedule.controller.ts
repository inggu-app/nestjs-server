import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateCallScheduleDto } from './dto/createCallSchedule.dto'
import { CallScheduleService } from './callSchedule.service'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'
import { CallScheduleRoutesEnum } from './callSchedule.constants'
import { AdminUserAuth } from '../../../global/decorators/AdminUserAuth.decorator'

@Controller()
export class CallScheduleController {
  constructor(private readonly callScheduleService: CallScheduleService) {}

  @AdminUserAuth({
    availability: 'canUpdateCallSchedule',
  })
  @UsePipes(new ValidationPipe())
  @Post(CallScheduleRoutesEnum.CREATE)
  async createCallSchedule(@Body() dto: CreateCallScheduleDto) {
    await this.callScheduleService.deleteActiveCallSchedule()

    return this.callScheduleService.createCallSchedule(dto)
  }

  @Get(CallScheduleRoutesEnum.GET)
  async getCallSchedule(@Query('updatedAt', new ParseDatePipe({ required: false })) updatedAt?: Date) {
    const callSchedule = await this.callScheduleService.getActiveCallSchedule()

    if ((callSchedule && updatedAt && updatedAt < callSchedule?.updatedAt) || !updatedAt) {
      return callSchedule
    } else {
      return {
        schedule: [],
        updatedAt: callSchedule?.updatedAt,
      }
    }
  }
}
