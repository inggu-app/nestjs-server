import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateCallScheduleDto } from './dto/createCallSchedule.dto'
import { CallScheduleService } from './callSchedule.service'
import { AdminUserAuth } from '../../global/decorators/AdminUserAuth.decorator'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { QueryOptions, Types } from 'mongoose'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { CustomParseStringPipe } from '../../global/pipes/string.pipe'
import { UpdateCallScheduleDto } from './dto/updateCallSchedule.dto'

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller()
export class CallScheduleController {
  constructor(private readonly callScheduleService: CallScheduleService) {}

  @AdminUserAuth({
    availability: 'canUpdateCallSchedule',
  })
  @Post('/')
  async create(@Body() dto: CreateCallScheduleDto) {
    await this.callScheduleService.create(dto)
    return this.callScheduleService.getByName(dto.name)
  }

  @Get('/by-id')
  getById(@MongoId('callScheduleId') id: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.callScheduleService.getById(id, queryOptions)
  }

  @Get('/by-name')
  getByName(@Query('callScheduleName', new CustomParseStringPipe()) name: string, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.callScheduleService.getByName(name, queryOptions)
  }

  @Get('/default-schedule')
  getDefaultSchedule(@MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.callScheduleService.getDefaultSchedule(queryOptions)
  }

  @Patch('/')
  update(@Body() dto: UpdateCallScheduleDto) {
    return this.callScheduleService.update(dto)
  }

  @Patch('/is-default')
  updateIsDefaultSchedule(@MongoId('callScheduleId') id: Types.ObjectId) {
    return this.callScheduleService.updateIsDefaultSchedule(id)
  }

  @Delete('/by-id')
  deleteById(@MongoId('callScheduleId') id: Types.ObjectId) {
    return this.callScheduleService.deleteById(id)
  }

  @Delete('/by-name')
  deleteByName(@Query('callScheduleName', new CustomParseStringPipe()) name: string) {
    return this.callScheduleService.deleteByName(name)
  }
}
