import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { SemesterStartDateService } from './semesterStartDate.service'
import { CreateSemesterStartDateDto } from './dto/createSemesterStartDate.dto'

@Controller()
export class SemesterStartDateController {
  constructor(private readonly semesterStartDateService: SemesterStartDateService) {}

  @Get('/get')
  getSemesterStartTime() {
    return this.semesterStartDateService.getActiveSemesterStartDate()
  }

  @UsePipes(new ValidationPipe())
  @Post('/create')
  async createSemesterStartTime(@Body() dto: CreateSemesterStartDateDto) {
    await this.semesterStartDateService.deleteActiveSemesterStartDate()

    return this.semesterStartDateService.createSemesterStartDate(dto)
  }
}
