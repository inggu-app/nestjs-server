import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { SemesterStartDateService } from './semesterStartDate.service'
import { CreateSemesterStartDateDto } from './dto/createSemesterStartDate.dto'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'

@Controller()
export class SemesterStartDateController {
  constructor(private readonly semesterStartDateService: SemesterStartDateService) {}

  @Get('/get')
  getSemesterStartTime(@Query('updatedAt', ParseDatePipe) updatedAt: Date) {
    return this.semesterStartDateService.getActiveSemesterStartDate(updatedAt)
  }

  @UsePipes(new ValidationPipe())
  @Post('/create')
  async createSemesterStartTime(@Body() dto: CreateSemesterStartDateDto) {
    await this.semesterStartDateService.deleteActiveSemesterStartDate()

    return this.semesterStartDateService.createSemesterStartDate(dto)
  }
}
