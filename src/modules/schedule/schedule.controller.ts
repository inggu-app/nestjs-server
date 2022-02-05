import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { CreateScheduleDto } from './dto/createSchedule.dto'
import { ScheduleService } from './schedule.service'
import { QueryOptions, Types } from 'mongoose'
import { GroupService } from '../group/group.service'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { ParseDatePipe } from '../../global/pipes/date.pipe'
import { NoteService } from '../note/note.service'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'

@Controller()
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly groupService: GroupService,
    private readonly noteService: NoteService
  ) {}

  @WhitelistedValidationPipe()
  @Post('/')
  async create(@Body() dto: CreateScheduleDto) {
    await this.groupService.throwIfNotExists({ _id: Types.ObjectId(dto.group) })

    // Обновляем уже существующие занятия
    const existLessons = dto.schedule.filter(lesson => lesson.id)
    for await (const lesson of existLessons) {
      await this.scheduleService.updateById(Types.ObjectId(lesson.id as string), lesson)
    }

    // Удаляем ненужные занятия и прикреплённые к ним заметки
    const groupSchedule = await this.scheduleService.getByGroup(new Types.ObjectId(dto.group), { projection: { _id: 1 } })
    const extraLessonIds = groupSchedule.filter(lesson => !existLessons.find(l => l.id === lesson.id)).map(l => l.id as Types.ObjectId)
    await this.scheduleService.deleteMany(extraLessonIds)
    await this.noteService.deleteByLessonIds(extraLessonIds)

    // Создаём новые занятия
    const newLessons = dto.schedule.filter(lesson => !lesson.id)
    if (newLessons.length) {
      await this.scheduleService.create({ group: dto.group, schedule: newLessons })
    }

    return
  }

  @Get('/by-group-id')
  async getByGroupId(@MongoId('groupId') groupId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    const group = await this.groupService.getById(groupId, { projection: { lastScheduleUpdate: 1 } })
    const lessonsSchedule = await this.scheduleService.getByGroup(groupId, queryOptions)

    return {
      schedule: lessonsSchedule,
      updatedAt: group.lastScheduleUpdate,
    }
  }

  @Get('/check')
  async checkScheduleUpdate(@MongoId('groupId') groupId: Types.ObjectId, @Query('updatedAt', new ParseDatePipe()) updatedAt: Date) {
    const group = await this.groupService.getById(groupId, { projection: { lastScheduleUpdate: 1 } })
    return {
      updated: group.lastScheduleUpdate > updatedAt,
    }
  }
}
