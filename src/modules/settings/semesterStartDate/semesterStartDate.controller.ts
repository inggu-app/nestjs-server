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
import { SemesterStartDateService } from './semesterStartDate.service'
import { CreateSemesterStartDateDto } from './dto/createSemesterStartDate.dto'
import { ParseDatePipe } from '../../../global/pipes/date.pipe'
import { AdminJwtAuthGuard } from '../../../global/guards/adminJwtAuth.guard'

@Controller()
export class SemesterStartDateController {
  constructor(private readonly semesterStartDateService: SemesterStartDateService) {}

  @Get('/get')
  async getSemesterStartTime(@Query('updatedAt', ParseDatePipe) updatedAt: Date) {
    const semesterStartTime = await this.semesterStartDateService.getActiveSemesterStartDate(
      updatedAt
    )
    return semesterStartTime || {}
  }

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/create')
  async createSemesterStartTime(@Body() dto: CreateSemesterStartDateDto) {
    await this.semesterStartDateService.deleteActiveSemesterStartDate()

    return this.semesterStartDateService.createSemesterStartDate(dto)
  }
}
