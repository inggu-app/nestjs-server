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
import {
  GROUP_NOT_FOUND,
  SCHEDULE_EXISTS,
  ScheduleAdditionalFieldsEnum,
  ScheduleField,
  ScheduleFieldsEnum,
} from './schedule.constants'
import { CallScheduleService } from '../settings/callSchedule/callSchedule.service'
import { ParseDatePipe } from '../../global/pipes/date.pipe'
import { ResponsibleJwtAuthGuard } from '../../global/guards/responsibleJwtAuth.guard'
import { AdminJwtAuthGuard } from '../../global/guards/adminJwtAuth.guard'
import { ParseFieldsPipe } from '../../global/pipes/fields.pipe'
import normalizeFields from '../../global/utils/normalizeFields'

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

    const scheduleCandidate = await this.scheduleService.get(dto.group, [])

    if (scheduleCandidate.length) {
      throw new HttpException(SCHEDULE_EXISTS, HttpStatus.BAD_REQUEST)
    }

    groupCandidate.isHaveSchedule = true
    await groupCandidate.save()

    await this.scheduleService.delete(groupCandidate.id)
    await this.scheduleService.create(dto)
  }

  @Get('/:group')
  async get(
    @Param('group', ParseMongoIdPipe) group: Types.ObjectId,
    @Query('updatedAt', ParseDatePipe) updatedAt: Date,
    @Query('fields', new ParseFieldsPipe(ScheduleFieldsEnum, ScheduleAdditionalFieldsEnum))
    fields: ScheduleField[]
  ) {
    const candidate = await this.groupService.getById(group)

    if (!candidate) {
      throw new HttpException(GROUP_NOT_FOUND, HttpStatus.NOT_FOUND)
    } else if (!(updatedAt < candidate.lastScheduleUpdate)) {
      return {}
    }

    const lessonsSchedule = await this.scheduleService.get(group, fields)
    const callSchedule = await this.callScheduleService.getActiveCallSchedule(new Date(0))

    const lessonsScheduleWithStartEnd = lessonsSchedule.map(lesson => {
      const call = callSchedule?.schedule.find(call => call.lessonNumber === lesson.number)

      return normalizeFields<ScheduleField[]>(fields, {
        ...lesson.toObject(),

        startTime: call?.start || new Date(0),
        endTime: call?.end || new Date(0),
      })
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
