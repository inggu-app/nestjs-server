import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { CreateScheduleDto } from './dto/createSchedule.dto'
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
import { ParseFieldsPipe } from '../../global/pipes/fields.pipe'
import normalizeFields from '../../global/utils/normalizeFields'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'

@Controller()
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly groupService: GroupService,
    private readonly callScheduleService: CallScheduleService
  ) {}

  @UseGuards(ResponsibleJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/')
  async create(@Body() dto: CreateScheduleDto) {
    await this.groupService.checkExists({ _id: dto.group })

    const existLessons = dto.schedule.filter(lesson => lesson.id)
    if (existLessons.length) {
      for await (const lesson of existLessons) {
        if (lesson.id) {
          await this.scheduleService.updateById(lesson.id, lesson)
        }
      }
    }

    const allLessons = await this.scheduleService.getByGroup(dto.group, ['id'])
    const extraLessons = allLessons.filter(lesson => !existLessons.find(l => l.id === lesson.id))
    await this.scheduleService.delete(
      dto.group,
      extraLessons.map(l => l.id)
    )

    const newLessons = dto.schedule.filter(lesson => !lesson.id)
    if (newLessons.length) {
      await this.scheduleService.create({ group: dto.group, schedule: newLessons })
    }

    return
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
      fields,
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

        const lessonsSchedule = await this.scheduleService.getByGroup(groupId, request.fields)
        const callSchedule = await this.callScheduleService.getActiveCallSchedule()

        const lessonsScheduleWithStartEnd = lessonsSchedule.map(lesson => {
          const call = callSchedule?.schedule.find(call => call.lessonNumber === lesson.number)

          return normalizeFields<ScheduleField[]>(
            {
              ...lesson.toObject(),

              startTime: call?.start || new Date(0),
              endTime: call?.end || new Date(0),
            },
            { fields: request.fields }
          )
        })

        return {
          schedule: lessonsScheduleWithStartEnd,
          updatedAt: group.lastScheduleUpdate,
        }
    }
  }
}
