import { BadRequestException, Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { SemesterRangeService } from './semesterRange.service'
import { CreateSemesterRangeDto } from './dto/createSemesterRange.dto'
import { SEMESTER_RANGE_DATE_INCORRECT_RANGE } from '../../../global/constants/errors.constants'
import { AdminUserAuth } from '../../../global/decorators/AdminUserAuth.decorator'
import { DateQueryParam } from '../../../global/decorators/DateQueryParam.decorator'

@Controller()
export class SemesterRangeController {
  constructor(private readonly semesterStartDateService: SemesterRangeService) {}

  @AdminUserAuth({
    availability: 'canUpdateSemesterRange',
  })
  @UsePipes(new ValidationPipe())
  @Post('/')
  async createSemesterStartTime(@Body() dto: CreateSemesterRangeDto) {
    if (dto.startDate >= dto.endDate) throw new BadRequestException(SEMESTER_RANGE_DATE_INCORRECT_RANGE)
    await this.semesterStartDateService.deleteActiveSemesterStartDate()

    return this.semesterStartDateService.createSemesterStartDate(dto)
  }

  @Get('/')
  async getSemesterStartTime(@DateQueryParam('updatedAt', { required: false }) updatedAt?: Date) {
    const semesterStartTime = await this.semesterStartDateService.getActiveSemesterStartDate()

    if ((semesterStartTime && semesterStartTime?.updatedAt && updatedAt && updatedAt < semesterStartTime?.updatedAt) || !updatedAt) {
      return semesterStartTime
    } else {
      return {
        date: new Date(0),
        updatedAt: semesterStartTime?.updatedAt,
      }
    }
  }
}
