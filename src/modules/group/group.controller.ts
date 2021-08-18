import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
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

@Controller()
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly facultyService: FacultyService
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

  @Get('/:id')
  async getById(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.groupService.getById(id)
  }

  @Get()
  async getAll() {
    return this.groupService.getAll()
  }

  @Get('get/:facultyId/dropdown')
  async getFacultyGroupsForDropdown(
    @Param('facultyId', ParseMongoIdPipe) facultyId: Types.ObjectId
  ) {
    const facultyCandidate = await this.facultyService.getById(facultyId)

    if (!facultyCandidate) {
      throw new HttpException(FACULTY_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return this.groupService.getByFacultyIdForDropdown(facultyId)
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete('/delete/:groupId')
  delete(@Param('groupId', ParseMongoIdPipe) groupId: Types.ObjectId) {
    return this.groupService.delete(groupId)
  }
}
