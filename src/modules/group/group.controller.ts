import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
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
import { FACULTY_NOT_FOUND } from '../faculty/faculty.constants'
import { AdminJwtAuthGuard } from '../../global/guards/adminJwtAuth.guard'
import { ResponsibleService } from '../responsible/responsible.service'
import { UpdateGroupDto } from './dto/updateGroup.dto'

@Controller()
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly facultyService: FacultyService,
    private readonly responsibleService: ResponsibleService
  ) {}

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/create')
  async create(@Body() dto: CreateGroupDto) {
    const facultyCandidate = await this.facultyService.getById(Types.ObjectId(dto.faculty))

    if (!facultyCandidate) {
      throw new HttpException(FACULTY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.groupService.create(dto)
  }

  @Get('/by-id')
  async getById(@Query('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.groupService.getById(id)
  }

  @UsePipes(new ValidationPipe())
  @Get('/all')
  async getAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('count', ParseIntPipe) count: number,
    @Query('title') title?: string
  ) {
    return {
      groups: await this.groupService.getAll(page, count, title || ''),
      count: await this.groupService.countAll(title || ''),
    }
  }

  @Get('/by-responsible')
  async getAllByResponsible(@Query('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.responsibleService.getAllGroupsByResponsible(id)
  }

  @Get('get/:facultyId/dropdown')
  async getFacultyGroupsForDropdown(
    @Param('facultyId', ParseMongoIdPipe) facultyId: Types.ObjectId
  ) {
    const facultyCandidate = await this.facultyService.getById(facultyId)

    if (!facultyCandidate) {
      throw new HttpException(FACULTY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.groupService.getByFacultyIdForDropdown(facultyId).sort({ title: 1 })
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
