import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { GroupService } from './group.service'
import { CreateGroupDto } from './dto/createGroup.dto'
import { QueryOptions, Types } from 'mongoose'
import { FacultyService } from '../faculty/faculty.service'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { AdminUserAuth } from '../../global/decorators/AdminUserAuth.decorator'

@Controller()
export class GroupController {
  constructor(private readonly groupService: GroupService, private readonly facultyService: FacultyService) {}

  @AdminUserAuth({
    availability: 'canCreateGroup',
  })
  @UsePipes(new ValidationPipe())
  @Post('/')
  async create(@Body() dto: CreateGroupDto) {
    await this.facultyService.getById(new Types.ObjectId(dto.faculty))

    return this.groupService.create(dto)
  }

  @Get('/by-id')
  async getByGroupId(@MongoId('groupId') groupId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.groupService.getById(groupId, queryOptions)
  }

  @Get('/by-ids')
  async getByGroupIds(
    @MongoId('groupIds', { multiple: true }) groupIds: Types.ObjectId[],
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      groups: await this.groupService.getByGroupIds(groupIds, queryOptions),
    }
  }

  @Get('/by-faculty-id')
  private async getByFacultyId(@MongoId('facultyId') facultyId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      groups: await this.groupService.getByFacultyId(facultyId, queryOptions),
    }
  }

  @Get('/many')
  private async getMany(
    @Query('page', new CustomParseIntPipe()) page: number,
    @Query('count', new CustomParseIntPipe()) count: number,
    @Query('title') title?: string,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      groups: await this.groupService.getAll(page, count, title, queryOptions),
      count: await this.groupService.countAll(title),
    }
  }

  @AdminUserAuth({
    availability: 'canUpdateGroup',
  })
  @UsePipes(new ValidationPipe())
  @Patch('/')
  async update(@Body() dto: UpdateGroupDto) {
    return this.groupService.update(dto)
  }

  @AdminUserAuth({
    availability: 'canDeleteGroup',
  })
  @Delete('/')
  delete(@MongoId('groupId') groupId: Types.ObjectId) {
    return this.groupService.delete(groupId)
  }
}
