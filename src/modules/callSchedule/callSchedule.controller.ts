import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common'
import { CreateCallScheduleDto } from './dto/createCallSchedule.dto'
import { CallScheduleService } from './callSchedule.service'
import { AdminUserAuth } from '../../global/decorators/AdminUserAuth.decorator'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { QueryOptions, Types } from 'mongoose'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { CustomParseStringPipe } from '../../global/pipes/string.pipe'
import { UpdateCallScheduleDto } from './dto/updateCallSchedule.dto'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'

@Controller()
export class CallScheduleController {
  constructor(private readonly callScheduleService: CallScheduleService) {}

  @AdminUserAuth({
    availability: 'canUpdateCallSchedule',
  })
  @WhitelistedValidationPipe()
  @Post('/')
  async create(@Body() dto: CreateCallScheduleDto) {
    await this.callScheduleService.create(dto)
    return this.callScheduleService.getByName(dto.name, undefined, { checkExistence: { callSchedule: false } })
  }

  @Get('/by-id')
  getById(@MongoId('callScheduleId') id: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.callScheduleService.getById(id, queryOptions)
  }

  @Get('/by-name')
  getByName(@Query('callScheduleName', new CustomParseStringPipe()) name: string, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.callScheduleService.getByName(name, queryOptions)
  }

  @Get('/default')
  getDefaultSchedule(@MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.callScheduleService.getDefaultSchedule(queryOptions)
  }

  @WhitelistedValidationPipe()
  @Patch('/')
  async update(@Body() dto: UpdateCallScheduleDto) {
    await this.callScheduleService.update(dto)
    return this.callScheduleService.getById(Types.ObjectId(dto.id), undefined, { checkExistence: { callSchedule: false } })
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
  async deleteByName(@Query('callScheduleName', new CustomParseStringPipe()) name: string) {
    await this.callScheduleService.deleteByName(name)
  }
}
