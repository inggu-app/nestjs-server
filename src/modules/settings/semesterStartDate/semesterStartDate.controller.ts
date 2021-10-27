import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { SemesterStartDateService } from './semesterStartDate.service'
import { CreateSemesterStartDateDto } from './dto/createSemesterStartDate.dto'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'
import checkAlternativeQueryParameters from '../../../global/utils/alternativeQueryParameters'
import {
  defaultSemesterStartDateCreateData,
  defaultSemesterStartDateGetData,
  SemesterStartDateRoutesEnum,
} from './semesterStartDate.constants'
import { Functionality } from '../../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../../global/enums/functionalities.enum'

@Controller()
export class SemesterStartDateController {
  constructor(private readonly semesterStartDateService: SemesterStartDateService) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.SEMESTER_START_DATE__CREATE,
    default: defaultSemesterStartDateCreateData,
    title: 'Установить начало старта семестра',
  })
  @Post(SemesterStartDateRoutesEnum.CREATE)
  async createSemesterStartTime(@Body() dto: CreateSemesterStartDateDto) {
    await this.semesterStartDateService.deleteActiveSemesterStartDate()

    return this.semesterStartDateService.createSemesterStartDate(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.SEMESTER_START_DATE__GET,
    default: defaultSemesterStartDateGetData,
    title: 'Получить дату старта семестра',
  })
  @Get(SemesterStartDateRoutesEnum.GET)
  async getSemesterStartTime(@Query('updatedAt', new ParseDatePipe({ required: false })) updatedAt?: Date) {
    const request = checkAlternativeQueryParameters<SemesterStartDateRoutesEnum>({
      updatedAt,
      enum: SemesterStartDateRoutesEnum.GET,
    })

    switch (request.enum) {
      case SemesterStartDateRoutesEnum.GET:
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
