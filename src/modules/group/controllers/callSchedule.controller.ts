import { Body, Controller, HttpStatus } from '@nestjs/common'
import { CallScheduleService } from '../services/callSchedule.service'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ApiResponseException } from '../../../global/decorators/ApiResponseException.decorator'
import { UpdateCallScheduleByFacultyDto } from '../dto/callSchedule/updateCallScheduleByFaculty.dto'
import { UpdateCallScheduleForAllGroupsDto } from '../dto/callSchedule/updateCallScheduleForAllGroups.dto'

@Controller()
export class CallScheduleController {
  constructor(private readonly callScheduleService: CallScheduleService) {}

  @ApiOperation({
    description: 'Эндпоинт позволяет обновить расписание звонков для всех групп факультета',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponseException()
  async updateByFacultyId(@Body() dto: UpdateCallScheduleByFacultyDto) {
    await this.callScheduleService.updateByFacultyId(dto.facultyId, dto.callSchedule)
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет обновить расписание звонков для всех групп в целом',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponseException()
  async updateForAllGroups(@Body() dto: UpdateCallScheduleForAllGroupsDto) {
    await this.callScheduleService.updateForAllGroups(dto.callSchedule)
  }
}
