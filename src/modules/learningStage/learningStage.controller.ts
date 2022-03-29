import { Body, Controller, Delete, Get, HttpStatus, Patch, Post } from '@nestjs/common'
import { LearningStageService } from './learningStage.service'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'
import { CreateLearningStageDto } from './dto/createLearningStage.dto'
import { UpdateLearningStageDto } from './dto/updateLearningStage.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { QueryOptions, Types } from 'mongoose'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { DateQueryParam } from '../../global/decorators/DateQueryParam.decorator'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiResponseException } from '../../global/decorators/ApiResponseException.decorator'
import { LearningStageModuleCreateResponseDto } from './dto/responses/LearningStageModuleCreateResponse.dto'
import { ApiMongoQueryOptions } from '../../global/decorators/ApiMongoQueryOptions.decorator'
import { LearningStageModuleGetCurrentResponseDto } from './dto/responses/LearningStageModuleGetCurrentResponse.dto'
import { LearningStageModuleGetByDateResponseDto } from './dto/responses/LearningStageModuleGetByDateResponse.dto'
import { LearningStageModuleGetCurrentAndFutureResponseDto } from './dto/responses/LearningStageModuleGetCurrentAndFutureResponse.dto'
import { MongoIdExample, MongoIdType } from '../../global/constants/constants'

@ApiTags('Стадии обучения')
@Controller()
export class LearningStageController {
  constructor(private readonly learningStageService: LearningStageService) {}

  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет создать стадию обучения',
  })
  @ApiResponseException()
  @ApiResponse({
    type: LearningStageModuleCreateResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post('/')
  async create(@Body() dto: CreateLearningStageDto) {
    return {
      learningStage: await this.learningStageService.create(dto),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить текущую стадию обучения',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: LearningStageModuleGetCurrentResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/current')
  async getCurrent(@MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      learningStage: await this.learningStageService.getByDate(new Date(), queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить стадию обучения на момент переданной даты',
  })
  @ApiQuery({
    name: 'date',
    description: 'Дата, на момент которой нужно получить стадию обучения',
    type: Date,
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: LearningStageModuleGetByDateResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/by-date')
  async getByDate(@DateQueryParam('date') date: Date, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      learningStage: await this.learningStageService.getByDate(date, queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить все стадии обучения наперёд начиная с текущей ',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: LearningStageModuleGetCurrentAndFutureResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/current-and-future')
  async getCurrentAndFuture(@MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      learningStages: await this.learningStageService.getCurrentAndFuture(queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет обновить стадию обучения',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @WhitelistedValidationPipe()
  @Patch('/')
  async update(@Body() dto: UpdateLearningStageDto) {
    await this.learningStageService.update(dto)
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет удалить стадию обучения',
  })
  @ApiQuery({
    name: 'learningStageId',
    description: 'id стадии обучения, которую нужно удалить',
    type: MongoIdType,
    example: MongoIdExample,
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete('/')
  async delete(@MongoId('learningStageId') id: Types.ObjectId) {
    await this.learningStageService.delete(id)
  }
}
