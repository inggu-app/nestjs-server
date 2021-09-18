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
import checkAlternativeQueryParameters from '../../../global/utils/alternativeQueryParameters'
import { GetSemesterStartDateEnum } from './semesterStartDate.constants'

@Controller()
export class SemesterStartDateController {
  constructor(private readonly semesterStartDateService: SemesterStartDateService) {}

  @Get('/')
  async getSemesterStartTime(
    @Query('updatedAt', new ParseDatePipe({ required: false })) updatedAt?: Date
  ) {
    const request = checkAlternativeQueryParameters<GetSemesterStartDateEnum>({
      updatedAt,
      enum: GetSemesterStartDateEnum.get,
    })

    switch (request.enum) {
      case GetSemesterStartDateEnum.get:
        const semesterStartTime = await this.semesterStartDateService.getActiveSemesterStartDate(
          updatedAt
        )
        return semesterStartTime || {}
    }
  }

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/')
  async createSemesterStartTime(@Body() dto: CreateSemesterStartDateDto) {
    await this.semesterStartDateService.deleteActiveSemesterStartDate()

    return this.semesterStartDateService.createSemesterStartDate(dto)
  }
}
