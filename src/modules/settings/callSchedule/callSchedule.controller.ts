import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateCallScheduleDto } from './dto/createCallSchedule.dto'
import { CallScheduleService } from './callSchedule.service'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'

@Controller()
export class CallScheduleController {
  constructor(private readonly callScheduleService: CallScheduleService) {}

  @Get('/get')
  getCallSchedule(@Query('updatedAt', ParseDatePipe) updatedAt: Date) {
    return this.callScheduleService.getActiveCallSchedule(updatedAt)
  }

  @UsePipes(new ValidationPipe())
  @Post('/create')
  async createCallSchedule(@Body() dto: CreateCallScheduleDto) {
    await this.callScheduleService.deleteActiveCallSchedule()

    return this.callScheduleService.createCallSchedule(dto)
  }
}
