import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateCallScheduleDto } from './dto/createCallSchedule.dto'
import { CallScheduleService } from './callSchedule.service'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'
import { CallScheduleRoutesEnum, defaultCallScheduleCreateData, defaultCallScheduleGetData } from './callSchedule.constants'
import { Functionality } from '../../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Расписание звонков')
@Controller()
export class CallScheduleController {
  constructor(private readonly callScheduleService: CallScheduleService) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.CALL_SCHEDULE__CREATE,
    default: defaultCallScheduleCreateData,
    title: 'Установить расписание звонков',
  })
  @Post(CallScheduleRoutesEnum.CREATE)
  async createCallSchedule(@Body() dto: CreateCallScheduleDto) {
    await this.callScheduleService.deleteActiveCallSchedule()

    return this.callScheduleService.createCallSchedule(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.CALL_SCHEDULE__GET,
    default: defaultCallScheduleGetData,
    title: 'Получить расписание звонков',
  })
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
