import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { GroupService } from './group.service'
import { CreateGroupDto } from './dto/createGroup.dto'
import { QueryOptions, Types } from 'mongoose'
import { FacultyService } from '../faculty/faculty.service'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import { GroupGetQueryParametersEnum, GroupRoutesEnum } from './group.constants'
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
  @Post(GroupRoutesEnum.CREATE)
  async create(@Body() dto: CreateGroupDto) {
    await this.facultyService.getById(dto.faculty)

    return this.groupService.create(dto)
  }

  @Get(GroupRoutesEnum.GET_BY_GROUP_ID)
  async getByGroupId(
    @MongoId(GroupGetQueryParametersEnum.GROUP_ID) groupId: Types.ObjectId,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return this.groupService.getById(groupId, queryOptions)
  }

  @Get(GroupRoutesEnum.GET_BY_GROUP_IDS)
  async getByGroupIds(
    @MongoId(GroupGetQueryParametersEnum.GROUP_IDS, { multiple: true }) groupIds: Types.ObjectId[],
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      groups: await this.groupService.getByGroupIds(groupIds, queryOptions),
    }
  }

  @Get(GroupRoutesEnum.GET_BY_FACULTY_ID)
  private async getByFacultyId(
    @MongoId(GroupGetQueryParametersEnum.FACULTY_ID) facultyId: Types.ObjectId,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      groups: await this.groupService.getByFacultyId(facultyId, queryOptions),
    }
  }

  @Get(GroupRoutesEnum.GET_MANY)
  private async getMany(
    @Query(GroupGetQueryParametersEnum.PAGE, new CustomParseIntPipe()) page: number,
    @Query(GroupGetQueryParametersEnum.COUNT, new CustomParseIntPipe()) count: number,
    @Query(GroupGetQueryParametersEnum.TITLE) title?: string,
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
  @Patch(GroupRoutesEnum.UPDATE)
  async update(@Body() dto: UpdateGroupDto) {
    return this.groupService.update(dto)
  }

  @AdminUserAuth({
    availability: 'canDeleteGroup',
  })
  @Delete(GroupRoutesEnum.DELETE)
  delete(@MongoId('groupId') groupId: Types.ObjectId) {
    return this.groupService.delete(groupId)
  }
}
