import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common'
import { GroupService } from './group.service'
import { CreateGroupDto } from './dto/createGroup.dto'
import { QueryOptions, Types } from 'mongoose'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { AdminUserAuth } from '../../global/decorators/AdminUserAuth.decorator'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'
import { IntQueryParam } from '../../global/decorators/IntQueryParam.decorator'
import { StringQueryParam } from '../../global/decorators/StringQueryParam.decorator'

@Controller()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @AdminUserAuth({
    availability: 'canCreateGroup',
  })
  @WhitelistedValidationPipe()
  @Post('/')
  async create(@Body() dto: CreateGroupDto) {
    return this.groupService.create(dto)
  }

  @Get('/by-id')
  async getById(@MongoId('groupId') groupId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.groupService.getById(groupId, queryOptions)
  }

  @Get('/by-ids')
  async getByIds(@MongoId('groupIds', { multiple: true }) groupIds: Types.ObjectId[], @MongoQueryOptions() queryOptions?: QueryOptions) {
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
    @IntQueryParam('page', { intType: 'positive' }) page: number,
    @IntQueryParam('page', { intType: 'positive' }) count: number,
    @StringQueryParam('title', { required: false }) title?: string,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      groups: await this.groupService.getMany(page, count, title, queryOptions),
      count: await this.groupService.countMany(title),
    }
  }

  @AdminUserAuth({
    availability: 'canUpdateGroup',
  })
  @WhitelistedValidationPipe()
  @Patch('/')
  async update(@Body() dto: UpdateGroupDto) {
    await this.groupService.update(dto)
    return this.groupService.getById(dto.id, undefined, { checkExistence: { group: false } })
  }

  @AdminUserAuth({
    availability: 'canDeleteGroup',
  })
  @Delete('/')
  async delete(@MongoId('groupId') groupId: Types.ObjectId) {
    await this.groupService.delete(groupId)
  }
}
