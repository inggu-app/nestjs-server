import { Body, Controller, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ApiResponseException } from '../../../global/decorators/ApiResponseException.decorator'
import { LearningStageService } from '../services/learningStage.service'
import { UpdateLearningStageByFacultyDto } from '../dto/learningStage/updateLearningStageByFaculty.dto'
import { UpdateLearningStageForAllDto } from '../dto/learningStage/updateLearningStageForAll.dto'

@Controller()
export class LearningStageController {
  constructor(private readonly learningStageService: LearningStageService) {}

  @ApiOperation({
    description: 'Эндпоинт позволяет обновить стадию обучения для всех групп факультета',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponseException()
  async updateByFacultyId(@Body() dto: UpdateLearningStageByFacultyDto) {
    await this.learningStageService.updateByFacultyId(dto.facultyId, dto.learningStage)
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет обновить стадию обучения для всех групп в целом',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponseException()
  async updateForAllGroups(@Body() dto: UpdateLearningStageForAllDto) {
    await this.learningStageService.updateForAllGroups(dto.learningStage)
  }
}
