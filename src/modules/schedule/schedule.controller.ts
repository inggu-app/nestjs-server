import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateScheduleDto } from './dto/createSchedule.dto'
import { ScheduleService } from './schedule.service'
import { Types } from 'mongoose'
import { GroupService } from '../group/group.service'
import {
  defaultScheduleCreateData,
  defaultScheduleGetByGroupIdData,
  LessonFieldsEnum,
  ScheduleAdditionalFieldsEnum,
  ScheduleField,
  ScheduleGetQueryParametersEnum,
  ScheduleRoutesEnum,
} from './schedule.constants'
import { CallScheduleService } from '../settings/callSchedule/callSchedule.service'
import normalizeFields from '../../global/utils/normalizeFields'
import { Fields } from '../../global/decorators/Fields.decorator'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { ParseDatePipe } from '../../global/pipes/date.pipe'

@Controller()
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly groupService: GroupService,
    private readonly callScheduleService: CallScheduleService
  ) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.SCHEDULE__CREATE,
    default: defaultScheduleCreateData,
    title: 'Создать или обновить расписание',
  })
  @Post(ScheduleRoutesEnum.CREATE)
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

    const allLessons = await this.scheduleService.getByGroup(dto.group, { fields: ['id'] })
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

  @Functionality({
    code: FunctionalityCodesEnum.SCHEDULE__GET_BY_GROUP_ID,
    default: defaultScheduleGetByGroupIdData,
    title: 'Получить расписание',
  })
  @Get(ScheduleRoutesEnum.GET_BY_GROUP_ID)
  async getByGroupId(
    @MongoId(ScheduleGetQueryParametersEnum.GROUP_ID) groupId: Types.ObjectId,
    @Query(ScheduleGetQueryParametersEnum.UPDATED_AT, new ParseDatePipe({ required: false })) updatedAt?: Date,
    @GetScheduleFields() fields?: ScheduleField[]
  ) {
    const group = await this.groupService.getById(groupId, { fields: ['lastScheduleUpdate'] })

    if (updatedAt && updatedAt >= group.lastScheduleUpdate) {
      return {
        schedule: [],
        updatedAt: group.lastScheduleUpdate,
      }
    }

    const lessonsSchedule = await this.scheduleService.getByGroup(groupId, { fields })
    const callSchedule = await this.callScheduleService.getActiveCallSchedule()

    const lessonsScheduleWithStartEnd = lessonsSchedule.map(lesson => {
      const call = callSchedule?.schedule.find(call => call.lessonNumber === lesson.number)

      return normalizeFields<ScheduleField[]>(
        {
          ...lesson.toObject(),

          startTime: call?.start || new Date(0),
          endTime: call?.end || new Date(0),
        },
        { fields }
      )
    })

    return {
      schedule: lessonsScheduleWithStartEnd,
      updatedAt: group.lastScheduleUpdate,
    }
  }
}

function GetScheduleFields() {
  return Fields({ fieldsEnum: LessonFieldsEnum, additionalFieldsEnum: ScheduleAdditionalFieldsEnum })
}
