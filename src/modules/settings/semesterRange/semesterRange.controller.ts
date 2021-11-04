import { BadRequestException, Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { SemesterRangeService } from './semesterRange.service'
import { CreateSemesterRangeDto } from './dto/createSemesterRange.dto'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'
import checkAlternativeQueryParameters from '../../../global/utils/alternativeQueryParameters'
import { defaultSemesterRangeDateCreateData, defaultSemesterRangeDateGetData, SemesterRangeDateRoutesEnum } from './semesterRange.constants'
import { Functionality } from '../../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'
import { ApiTags } from '@nestjs/swagger'
import { SEMESTER_RANGE_DATE_INCORRECT_RANGE } from '../../../global/constants/errors.constants'

@ApiTags('Дата старта семестра')
@Controller()
export class SemesterRangeController {
  constructor(private readonly semesterStartDateService: SemesterRangeService) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.SEMESTER_RANGE__CREATE,
    default: defaultSemesterRangeDateCreateData,
    title: 'Установить начало старта семестра',
  })
  @Post(SemesterRangeDateRoutesEnum.CREATE)
  async createSemesterStartTime(@Body() dto: CreateSemesterRangeDto) {
    if (dto.startDate >= dto.endDate) throw new BadRequestException(SEMESTER_RANGE_DATE_INCORRECT_RANGE)
    await this.semesterStartDateService.deleteActiveSemesterStartDate()

    return this.semesterStartDateService.createSemesterStartDate(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.SEMESTER_RANGE__GET,
    default: defaultSemesterRangeDateGetData,
    title: 'Получить дату старта семестра',
  })
  @Get(SemesterRangeDateRoutesEnum.GET)
  async getSemesterStartTime(@Query('updatedAt', new ParseDatePipe({ required: false })) updatedAt?: Date) {
    const request = checkAlternativeQueryParameters<SemesterRangeDateRoutesEnum>({
      updatedAt,
      enum: SemesterRangeDateRoutesEnum.GET,
    })

    switch (request.enum) {
      case SemesterRangeDateRoutesEnum.GET:
        const semesterStartTime = await this.semesterStartDateService.getActiveSemesterStartDate()

        if ((semesterStartTime && semesterStartTime?.updatedAt && request.updatedAt < semesterStartTime?.updatedAt) || !request.updatedAt) {
          return semesterStartTime
        } else {
          return {
            date: new Date(0),
            updatedAt: semesterStartTime?.updatedAt,
          }
        }
    }
  }
}
