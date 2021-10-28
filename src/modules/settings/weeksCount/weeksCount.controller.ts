import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { WeeksCountService } from './weeksCount.service'
import { CreateWeeksCountDto } from './dto/createWeeksCount.dto'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'
import checkAlternativeQueryParameters from '../../../global/utils/alternativeQueryParameters'
import { defaultWeeksCountCreateData, defaultWeeksCountGetData, WeeksCountRoutesEnum } from './weeksCount.constants'
import { Functionality } from '../../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Количество недель')
@Controller()
export class WeeksCountController {
  constructor(private readonly weeksCountService: WeeksCountService) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.WEEKS_COUNT__CREATE,
    default: defaultWeeksCountCreateData,
    title: 'Установить количество недель в семестре',
  })
  @Post(WeeksCountRoutesEnum.CREATE)
  async createWeeksCount(@Body() dto: CreateWeeksCountDto) {
    await this.weeksCountService.deleteActiveWeeksCount()

    return this.weeksCountService.createWeeksCount(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.WEEKS_COUNT__GET,
    default: defaultWeeksCountGetData,
    title: 'Получить количество недель в семестре',
  })
  @Get(WeeksCountRoutesEnum.GET)
  async getWeeksCount(@Query('updatedAt', new ParseDatePipe({ required: false })) updatedAt?: Date) {
    const request = checkAlternativeQueryParameters<WeeksCountRoutesEnum>({
      updatedAt,
      enum: WeeksCountRoutesEnum.GET,
    })

    switch (request.enum) {
      case WeeksCountRoutesEnum.GET:
        const weeksCount = await this.weeksCountService.getActiveWeeksCount()

        if ((weeksCount && weeksCount?.updatedAt && request.updatedAt < weeksCount?.updatedAt) || !request.updatedAt) {
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
