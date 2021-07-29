import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { WeeksCountService } from './weeksCount.service'
import { CreateWeeksCountDto } from './dto/createWeeksCount.dto'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'

@Controller()
export class WeeksCountController {
  constructor(private readonly weeksCountService: WeeksCountService) {}

  @Get('/get')
  async getWeeksCount(@Query('updatedAt', ParseDatePipe) updatedAt: Date) {
    const weeksCount = await this.weeksCountService.getActiveWeeksCount(updatedAt)
    return weeksCount || {}
  }

  @UsePipes(new ValidationPipe())
  @Post('/create')
  async createWeeksCount(@Body() dto: CreateWeeksCountDto) {
    await this.weeksCountService.deleteActiveWeeksCount()

    return this.weeksCountService.createWeeksCount(dto)
  }
}
