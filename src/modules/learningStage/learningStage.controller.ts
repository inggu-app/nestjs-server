import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common'
import { LearningStageService } from './learningStage.service'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'
import { CreateLearningStageDto } from './dto/createLearningStage.dto'
import { UpdateLearningStageDto } from './dto/updateLearningStage.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { QueryOptions, Types } from 'mongoose'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { DateQueryParam } from '../../global/decorators/DateQueryParam.decorator'

@Controller()
export class LearningStageController {
  constructor(private readonly learningStageService: LearningStageService) {}

  @WhitelistedValidationPipe()
  @Post('/')
  async create(@Body() dto: CreateLearningStageDto) {
    await this.learningStageService.create(dto)
    return this.learningStageService.getByDate(dto.start)
  }

  @Get('/current')
  getCurrent(@MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.learningStageService.getByDate(new Date(), queryOptions)
  }

  @Get('/by-date')
  getByDate(@DateQueryParam('date') date: Date, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.learningStageService.getByDate(date, queryOptions)
  }

  @Get('/current-and-future')
  async getCurrentAndFuture(@MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      learningStages: await this.learningStageService.getCurrentAndFuture(queryOptions),
    }
  }

  @WhitelistedValidationPipe()
  @Patch('/')
  async update(@Body() dto: UpdateLearningStageDto) {
    await this.learningStageService.update(dto)
  }

  @Delete('/')
  async delete(@MongoId('learningStageId') id: Types.ObjectId) {
    await this.learningStageService.delete(id)
  }
}
