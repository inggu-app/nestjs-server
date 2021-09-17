import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { GroupService } from './group.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { FacultyService } from '../faculty/faculty.service'
import { AdminJwtAuthGuard } from '../../global/guards/adminJwtAuth.guard'
import { ResponsibleService } from '../responsible/responsible.service'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'
import { GetGroupsEnum, GroupField, GroupFieldsEnum } from './group.constants'
import { ParseFieldsPipe } from '../../global/pipes/fields.pipe'

@Controller()
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly facultyService: FacultyService,
    private readonly responsibleService: ResponsibleService
  ) {}

  @Get('/')
  async get(
    @Query('groupId', ParseMongoIdPipe) groupId?: Types.ObjectId,
    @Query('responsibleId', ParseMongoIdPipe) responsibleId?: Types.ObjectId,
    @Query('facultyId', ParseMongoIdPipe) facultyId?: Types.ObjectId,
    @Query('page', CustomParseIntPipe) page?: number,
    @Query('count', CustomParseIntPipe) count?: number,
    @Query('title') title?: string,
    @Query('fields', new ParseFieldsPipe(GroupFieldsEnum)) fields?: GroupField[]
  ) {
    const request = checkAlternativeQueryParameters<GetGroupsEnum>(
      { required: { groupId }, fields, enum: GetGroupsEnum.groupId },
      {
        required: { responsibleId },
        page,
        count,
        title,
        fields,
        enum: GetGroupsEnum.responsibleId,
      },
      { required: { facultyId }, page, count, title, fields, enum: GetGroupsEnum.facultyId },
      { required: { page, count }, title, fields, enum: GetGroupsEnum.all }
    )

    switch (request.enum) {
      case GetGroupsEnum.groupId:
        return this.groupService.getById(request.groupId, request.fields)
      case GetGroupsEnum.responsibleId:
        return this.responsibleService.getAllGroupsByResponsible(
          request.responsibleId,
          request.fields
        )
      case GetGroupsEnum.facultyId:
        return this.groupService.getByFacultyId(request.facultyId, request.fields)
      case GetGroupsEnum.all:
        return {
          groups: await this.groupService.getAll(
            request.page,
            request.count,
            request.title,
            request.fields
          ),
          count: await this.groupService.countAll(request.title),
        }
    }
  }

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/create')
  async create(@Body() dto: CreateGroupDto) {
    await this.facultyService.getById(Types.ObjectId(dto.faculty))

    return this.groupService.create(dto)
  }

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch('/')
  async update(@Body() dto: UpdateGroupDto) {
    return this.groupService.update(dto)
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete('/delete/:groupId')
  async delete(@Param('groupId', ParseMongoIdPipe) groupId: Types.ObjectId) {
    return this.groupService.delete(groupId)
  }
}
