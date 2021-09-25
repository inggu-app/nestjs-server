import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { CreateScheduleDto } from './dto/create-schedule.dto'
import { ScheduleService } from './schedule.service'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { GroupService } from '../group/group.service'
import {
  GetScheduleEnum,
  ScheduleAdditionalFieldsEnum,
  ScheduleField,
  LessonFieldsEnum,
} from './schedule.constants'
import { CallScheduleService } from '../settings/callSchedule/callSchedule.service'
import { ParseDatePipe } from '../../global/pipes/date.pipe'
import { ResponsibleJwtAuthGuard } from '../../global/guards/responsibleJwtAuth.guard'
import { AdminJwtAuthGuard } from '../../global/guards/adminJwtAuth.guard'
import { ParseFieldsPipe } from '../../global/pipes/fields.pipe'
import normalizeFields from '../../global/utils/normalizeFields'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'
import { GROUP_WITH_ID_NOT_FOUND, SCHEDULE_EXISTS } from '../../global/constants/errors.constants'

@Controller()
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly groupService: GroupService,
    private readonly callScheduleService: CallScheduleService
  ) {}

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/')
  async create(@Body() dto: CreateScheduleDto) {
    const groupCandidate = await this.groupService.getById(dto.group)

    const scheduleCandidate = await this.scheduleService.get(dto.group, [])

    if (scheduleCandidate.length) {
      throw new HttpException(SCHEDULE_EXISTS, HttpStatus.BAD_REQUEST)
    }

    groupCandidate.isHaveSchedule = true
    await groupCandidate.save()

    await this.scheduleService.delete(groupCandidate.id)
    await this.scheduleService.create(dto)
  }

  @Get('/')
  async get(
    @Query('groupId', new ParseMongoIdPipe()) groupId: Types.ObjectId,
    @Query('updatedAt', new ParseDatePipe({ required: false })) updatedAt?: Date,
    @Query(
      'fields',
      new ParseFieldsPipe({
        fieldsEnum: LessonFieldsEnum,
        additionalFieldsEnum: ScheduleAdditionalFieldsEnum,
      })
    )
    fields?: ScheduleField[]
  ) {
    const request = checkAlternativeQueryParameters<GetScheduleEnum>({
      required: { groupId },
      updatedAt,
      enum: GetScheduleEnum.groupId,
    })

    switch (request.enum) {
      case GetScheduleEnum.groupId:
        const group = await this.groupService.getById(groupId, ['lastScheduleUpdate'])

        if (updatedAt && updatedAt >= group.lastScheduleUpdate) {
          return {
            schedule: [],
            updatedAt: group.lastScheduleUpdate,
          }
        }

        const lessonsSchedule = await this.scheduleService.get(groupId, fields)
        const callSchedule = await this.callScheduleService.getActiveCallSchedule()

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
          updatedAt: group.lastScheduleUpdate,
        }
    }
  }

  @UseGuards(ResponsibleJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch('/')
  async update(@Body() dto: CreateScheduleDto) {
    const candidate = await this.groupService.updateLastScheduleUpdate(dto, new Date())

    if (!candidate) {
      throw new HttpException(GROUP_WITH_ID_NOT_FOUND(dto.group), HttpStatus.NOT_FOUND)
    }

    await this.scheduleService.delete(dto.group)

    await this.scheduleService.create(dto)
  }
}
