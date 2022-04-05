import { BadRequestException, Body, Controller, HttpStatus } from '@nestjs/common'
import { CallScheduleService } from '../services/callSchedule.service'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ApiResponseException } from '../../../global/decorators/ApiResponseException.decorator'
import { UpdateCallScheduleByFacultyDto } from '../dto/callSchedule/updateCallScheduleByFaculty.dto'
import { UserAuth } from '../../../global/decorators/UserAuth.decorator'
import { RequestUser } from '../../../global/decorators/RequestUser.decorator'
import { UpdateGroupCallScheduleForFacultiesAvailabilityModel } from '../../user/models/user.model'

@Controller()
export class CallScheduleController {
  constructor(private readonly callScheduleService: CallScheduleService) {}

  @UserAuth({
    availability: 'updateGroupCallScheduleForFaculties',
    availabilityKey: 'available',
  })
  @ApiOperation({
    description: 'Эндпоинт позволяет обновить расписание звонков для всех групп факультета',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponseException()
  async updateByFacultyId(
    @Body() dto: UpdateCallScheduleByFacultyDto,
    @RequestUser() user: RequestUser<UpdateGroupCallScheduleForFacultiesAvailabilityModel>
  ) {
    // проверяем пытается ли пользователь редактировать недоступные ему факультеты
    if (!user.availability.all) {
      if (!user.availability.availableFaculties.includes(dto.facultyId))
        throw new BadRequestException(
          `Пользователь не может редактировать расписание звонков для групп, принадлежащих факультету с id ${dto.facultyId}`
        )
    }

    await this.callScheduleService.updateByFacultyId(dto.facultyId, dto.callSchedule)
  }
}
