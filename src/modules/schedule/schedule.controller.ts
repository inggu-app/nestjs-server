import { BadRequestException, Body, Controller, Get, HttpStatus, Post } from '@nestjs/common'
import { CreateScheduleDto } from './dto/createSchedule.dto'
import { ScheduleService } from './schedule.service'
import { QueryOptions, Types } from 'mongoose'
import { GroupService } from '../group/services/group.service'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { NoteService } from '../note/note.service'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'
import { DateQueryParam } from '../../global/decorators/DateQueryParam.decorator'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MongoIdExample } from '../../global/constants/constants'
import { ApiMongoQueryOptions } from '../../global/decorators/ApiMongoQueryOptions.decorator'
import { ApiResponseException } from '../../global/decorators/ApiResponseException.decorator'
import { ScheduleModuleGetByGroupIdResponseDto } from './dto/responses/ScheduleModuleGetByGroupIdResponseDto'
import { ScheduleModuleCheckScheduleUpdateResponseDto } from './dto/responses/ScheduleModuleCheckScheduleUpdateResponseDto'
import { UserAuth } from '../../global/decorators/UserAuth.decorator'
import { CreateScheduleAvailabilityModel } from '../user/models/user.model'
import { RequestUser } from '../../global/decorators/RequestUser.decorator'
import { FacultyService } from '../faculty/faculty.service'

@ApiTags('Расписание занятий')
@Controller()
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly groupService: GroupService,
    private readonly facultyService: FacultyService,
    private readonly noteService: NoteService
  ) {}

  @UserAuth({
    availability: 'createSchedule',
    availabilityKey: 'available',
  })
  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет установить расписание занятий для группы.',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @Post('/')
  async create(@Body() dto: CreateScheduleDto, @RequestUser() user: RequestUser<CreateScheduleAvailabilityModel>) {
    if (user.availability.forbiddenGroups.includes(dto.group)) throw new BadRequestException('Для данной группы нельзя создать расписание')
    if (!user.availability.all) {
      if (!user.availability.availableGroups.includes(dto.group)) {
        const group = await this.groupService.getById(dto.group, { projection: { faculty: 1 } })
        if (!user.availability.availableFaculties.includes(group.faculty)) {
          throw new BadRequestException('Для данной группы нельзя создать расписание')
        }
      }
    }

    // Обновляем уже существующие занятия
    const existLessons = dto.schedule.filter(lesson => lesson.id)
    for await (const lesson of existLessons) {
      await this.scheduleService.updateById(lesson.id as Types.ObjectId, lesson)
    }

    // Удаляем ненужные занятия и прикреплённые к ним заметки
    const groupSchedule = await this.scheduleService.getByGroupId(dto.group, { projection: { _id: 1 } })
    const extraLessonIds = groupSchedule
      .filter(lesson => !existLessons.find(l => (l.id as Types.ObjectId).toString() === lesson.id.toString()))
      .map(l => l.id as Types.ObjectId)
    await this.noteService.deleteAllByLessonIds(extraLessonIds, { checkExistence: { lessons: false } })
    await this.scheduleService.deleteMany(extraLessonIds, { checkExistence: { schedule: false } })

    // Создаём новые занятия
    const newLessons = dto.schedule.filter(lesson => !lesson.id)
    if (newLessons.length) {
      await this.scheduleService.create({ group: dto.group, schedule: newLessons }, { checkExistence: { group: false } })
    }

    // Обновляем поле lastScheduleUpdate для группы
    await this.groupService.updateLastScheduleUpdate(dto.group, new Date(), { checkExistence: { group: false } })
  }

  @ApiOperation({
    description:
      'Эндпоинт позволяет получить расписание занятий по id группы. Поля занятий, которые будут возвращаться в поле ответа schedule, зависят от параметра projection, который передаётся в query-параметре queryOptions - будут возвращаться те поля, у которых в параметре будет значение 1',
  })
  @ApiQuery({
    type: MongoId,
    description: 'id группы, расписание которой нужно получить',
    name: 'groupId',
    example: MongoIdExample,
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: ScheduleModuleGetByGroupIdResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/by-group-id')
  async getByGroupId(@MongoId('groupId') groupId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    const group = await this.groupService.getById(groupId, { projection: { lastScheduleUpdate: 1 } })
    const lessonsSchedule = await this.scheduleService.getByGroupId(groupId, queryOptions, { checkExistence: { group: false } })

    return {
      schedule: lessonsSchedule,
      updatedAt: group.lastScheduleUpdate,
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет проверить обновилось ли расписание группы.',
  })
  @ApiQuery({
    name: 'groupId',
    type: MongoId,
    description: 'id группы',
    example: MongoIdExample,
  })
  @ApiQuery({
    name: 'updatedAt',
    type: Date,
    description: 'Дата последнего обновления расписания, которая имеется у клиента.',
    example: new Date(),
  })
  @ApiResponseException()
  @ApiResponse({
    type: ScheduleModuleCheckScheduleUpdateResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/check')
  async checkScheduleUpdate(@MongoId('groupId') groupId: Types.ObjectId, @DateQueryParam('updatedAt') updatedAt: Date) {
    const group = await this.groupService.getById(groupId, { projection: { lastScheduleUpdate: 1 } })
    return {
      updated: group.lastScheduleUpdate > updatedAt,
    }
  }
}
