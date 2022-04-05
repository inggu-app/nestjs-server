import { BadRequestException, Body, Controller, HttpStatus, Patch } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiResponseException } from '../../../global/decorators/ApiResponseException.decorator'
import { LearningStageService } from '../services/learningStage.service'
import { UpdateLearningStageByFacultyDto } from '../dto/learningStage/updateLearningStageByFaculty.dto'
import { UserAuth } from '../../../global/decorators/UserAuth.decorator'
import { RequestUser } from '../../../global/decorators/RequestUser.decorator'
import { UpdateGroupLearningStageForFacultiesAvailabilityModel } from '../../user/models/user.model'

@ApiTags('Группы')
@Controller('/learning-stage')
export class LearningStageController {
  constructor(private readonly learningStageService: LearningStageService) {}

  @UserAuth({
    availability: 'updateGroupLearningStageForFaculties',
    availabilityKey: 'available',
  })
  @ApiOperation({
    description: 'Эндпоинт позволяет обновить стадию обучения для всех групп факультета',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponseException()
  @Patch('/')
  async updateByFacultyId(
    @Body() dto: UpdateLearningStageByFacultyDto,
    @RequestUser() user: RequestUser<UpdateGroupLearningStageForFacultiesAvailabilityModel>
  ) {
    // проверяем пытается ли пользователь редактировать недоступные ему факультеты
    if (!user.availability.all) {
      if (!user.availability.availableFaculties.includes(dto.facultyId))
        throw new BadRequestException(
          `Пользователь не может редактировать стадию обучения для групп, принадлежащих факультету с id ${dto.facultyId}`
        )
    }

    await this.learningStageService.updateByFacultyId(dto.facultyId, dto.learningStage)
  }
}
