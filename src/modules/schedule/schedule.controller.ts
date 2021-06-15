import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { CreateScheduleDto } from './dto/create-schedule.dto'
import { ScheduleService } from './schedule.service'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { GroupService } from '../group/group.service'
import { GROUP_NOT_FOUND } from './schedule.constants'

@Controller()
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly groupService: GroupService
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('/create')
  async create(@Body() dto: CreateScheduleDto) {
    const candidate = await this.groupService.getById(dto.group)

    if (!candidate) {
      throw new HttpException(GROUP_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    await this.scheduleService.create(dto)
  }

  @Get('/get/:groupId')
  get(@Param('groupId', ParseMongoIdPipe) groupId: Types.ObjectId) {
    return this.scheduleService.get(groupId)
  }
}
