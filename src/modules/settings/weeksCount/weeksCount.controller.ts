import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { WeeksCountService } from './weeksCount.service'
import { CreateWeeksCountDto } from './dto/createWeeksCount.dto'

@Controller()
export class WeeksCountController {
  constructor(private readonly weeksCountService: WeeksCountService) {}

  @Get('/get')
  getWeeksCount() {
    return this.weeksCountService.getActiveWeeksCount()
  }

  @UsePipes(new ValidationPipe())
  @Post('/create')
  async createWeeksCount(@Body() dto: CreateWeeksCountDto) {
    await this.weeksCountService.deleteActiveWeeksCount()

    return this.weeksCountService.createWeeksCount(dto)
  }
}
