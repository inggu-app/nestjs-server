import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { WeeksCountService } from './weeksCount.service'
import { CreateWeeksCountDto } from './dto/createWeeksCount.dto'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'
import { AdminJwtAuthGuard } from '../../../global/guards/adminJwtAuth.guard'
import checkAlternativeQueryParameters from '../../../global/utils/alternativeQueryParameters'
import { GetWeeksCountEnum } from './weeksCount.constants'

@Controller()
export class WeeksCountController {
  constructor(private readonly weeksCountService: WeeksCountService) {}

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/')
  async createWeeksCount(@Body() dto: CreateWeeksCountDto) {
    await this.weeksCountService.deleteActiveWeeksCount()

    return this.weeksCountService.createWeeksCount(dto)
  }

  @Get('/')
  async getWeeksCount(
    @Query('updatedAt', new ParseDatePipe({ required: false })) updatedAt?: Date
  ) {
    const request = checkAlternativeQueryParameters<GetWeeksCountEnum>({
      updatedAt,
      enum: GetWeeksCountEnum.get,
    })

    switch (request.enum) {
      case GetWeeksCountEnum.get:
        const weeksCount = await this.weeksCountService.getActiveWeeksCount()

        if (
          (weeksCount && weeksCount?.updatedAt && request.updatedAt < weeksCount?.updatedAt) ||
          !request.updatedAt
        ) {
          return weeksCount
        } else {
          return {
            count: 0,
            updatedAt: weeksCount?.updatedAt,
          }
        }
    }
  }
}
