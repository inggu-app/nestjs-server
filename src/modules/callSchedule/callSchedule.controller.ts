import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common'
import { CreateCallScheduleDto } from './dto/createCallSchedule.dto'
import { CallScheduleService } from './callSchedule.service'
import { AdminUserAuth } from '../../global/decorators/AdminUserAuth.decorator'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { QueryOptions, Types } from 'mongoose'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { UpdateCallScheduleDto } from './dto/updateCallSchedule.dto'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'
import { StringQueryParam } from '../../global/decorators/StringQueryParam.decorator'
import { FacultyService } from '../faculty/faculty.service'
import { GroupService } from '../group/group.service'

@Controller()
export class CallScheduleController {
  constructor(
    private readonly callScheduleService: CallScheduleService,
    private readonly facultyService: FacultyService,
    private readonly groupService: GroupService
  ) {}

  @AdminUserAuth({
    availability: 'canUpdateCallSchedule',
  })
  @WhitelistedValidationPipe()
  @Post('/')
  async create(@Body() dto: CreateCallScheduleDto) {
    return this.callScheduleService.create(dto)
  }

  @Get('/by-id')
  getById(@MongoId('callScheduleId') id: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.callScheduleService.getById(id, queryOptions)
  }

  @Get('/by-name')
  getByName(@StringQueryParam('callScheduleName') name: string, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.callScheduleService.getByName(name, queryOptions)
  }

  @Get('/by-group')
  async getByGroupId(@MongoId('groupId') groupId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    const group = await this.groupService.getById(groupId, { projection: { callSchedule: 1, faculty: 1 } })
    if (group.callSchedule) return this.callScheduleService.getById(group.callSchedule as Types.ObjectId, queryOptions)
    const faculty = await this.facultyService.getById(
      group.faculty as Types.ObjectId,
      { projection: { callSchedule: 1 } },
      { checkExistence: { faculty: false } }
    )
    if (faculty.callSchedule) return this.callScheduleService.getById(faculty.callSchedule as Types.ObjectId, queryOptions)
    return this.callScheduleService.getDefaultSchedule(queryOptions)
  }

  @Get('/by-faculty')
  async getByFacultyId(@MongoId('facultyId') facultyId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    const faculty = await this.facultyService.getById(facultyId, { projection: { callSchedule: 1 } })
    if (faculty.callSchedule) return this.callScheduleService.getById(faculty.callSchedule as Types.ObjectId, queryOptions)
    return this.callScheduleService.getDefaultSchedule(queryOptions)
  }

  @Get('/default')
  getDefaultSchedule(@MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.callScheduleService.getDefaultSchedule(queryOptions)
  }

  @WhitelistedValidationPipe()
  @Patch('/')
  async update(@Body() dto: UpdateCallScheduleDto) {
    await this.callScheduleService.update(dto)
    return this.callScheduleService.getById(dto.id, undefined, { checkExistence: { callSchedule: false } })
  }

  @Patch('/default')
  async updateDefaultSchedule(@MongoId('callScheduleId') id: Types.ObjectId) {
    await this.callScheduleService.updateDefaultSchedule(id)
    return this.callScheduleService.getDefaultSchedule(undefined, { checkExistence: { callSchedule: false } })
  }

  @Delete('/by-id')
  async deleteById(@MongoId('callScheduleId') id: Types.ObjectId) {
    await this.callScheduleService.deleteById(id)
  }

  @Delete('/by-name')
  async deleteByName(@StringQueryParam('callScheduleName') name: string) {
    await this.callScheduleService.deleteByName(name)
  }
}
