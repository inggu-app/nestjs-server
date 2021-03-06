import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common'
import { CreateScheduleDto } from './dto/create-schedule.dto'
import { ScheduleService } from './schedule.service'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { GroupService } from '../group/group.service'
import { GROUP_NOT_FOUND, SCHEDULE_EXISTS } from './schedule.constants'
import { CallScheduleService } from '../settings/callSchedule/callSchedule.service'
import { ParseDatePipe } from '../../global/pipes/date.pipe'
import { ResponsibleJwtAuthGuard } from '../../global/guards/responsibleJwtAuth.guard'
import { AdminJwtAuthGuard } from '../../global/guards/adminJwtAuth.guard'

@Controller()
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly groupService: GroupService,
    private readonly callScheduleService: CallScheduleService
  ) {}

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/create')
  async create(@Body() dto: CreateScheduleDto) {
    const groupCandidate = await this.groupService.getById(dto.group)

    if (!groupCandidate) {
      throw new HttpException(GROUP_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    const scheduleCandidate = await this.scheduleService.get(dto.group)

    if (scheduleCandidate.length) {
      throw new HttpException(SCHEDULE_EXISTS, HttpStatus.BAD_REQUEST)
    }

    groupCandidate.isHaveSchedule = true
    await groupCandidate.save()

    await this.scheduleService.delete(groupCandidate.id)
    await this.scheduleService.create(dto)
  }

  @Get('/get/:group')
  async get(
    @Param('group', ParseMongoIdPipe) group: Types.ObjectId,
    @Query('updatedAt', ParseDatePipe) updatedAt: Date
  ) {
    const candidate = await this.groupService.getById(group)

    if (!candidate) {
      throw new HttpException(GROUP_NOT_FOUND, HttpStatus.NOT_FOUND)
    } else if (!(updatedAt < candidate.lastScheduleUpdate)) {
      return {}
    }

    const lessonsSchedule = await this.scheduleService.get(group)
    const callSchedule = await this.callScheduleService.getActiveCallSchedule(new Date(0))

    const lessonsScheduleWithStartEnd = lessonsSchedule.map(lesson => {
      const call = callSchedule?.schedule.find(call => call.lessonNumber === lesson.number)
      return {
        id: lesson.id,
        weekDay: lesson.weekDay,
        weeks: lesson.weeks,
        number: lesson.number,
        title: lesson.title,
        teacher: lesson.teacher,
        classroom: lesson.classroom,
        type: lesson.type,
        endTime: call?.end || new Date(0),
        startTime: call?.start || new Date(0),
      }
    })

    return {
      schedule: lessonsScheduleWithStartEnd,
      updatedAt: candidate.lastScheduleUpdate,
    }
  }

  @UseGuards(ResponsibleJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch('/update')
  async update(@Body() dto: CreateScheduleDto) {
    const candidate = await this.groupService.updateLastScheduleUpdate(dto, new Date())

    if (!candidate) {
      throw new HttpException(GROUP_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    await this.scheduleService.delete(dto.group)

    await this.scheduleService.create(dto)
  }
}
