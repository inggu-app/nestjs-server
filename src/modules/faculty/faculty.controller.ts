import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { FacultyService } from './faculty.service'
import { CreateFacultyDto } from './dto/create-faculty.dto'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { GroupService } from '../group/group.service'
import { AdminJwtAuthGuard } from '../../global/guards/adminJwtAuth.guard'

@Controller()
export class FacultyController {
  constructor(
    private readonly facultyService: FacultyService,
    private readonly groupService: GroupService
  ) {}

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/create')
  create(@Body() dto: CreateFacultyDto) {
    return this.facultyService.create(dto)
  }

  @Get('/all')
  async getAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('count', ParseIntPipe) count: number,
    @Query('title') title?: string
  ) {
    return {
      faculties: await this.facultyService.getAll(page, count, title || ''),
      count: await this.facultyService.countAll(title || ''),
    }
  }

  @Get('/by-id')
  getById(@Query('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.facultyService.getById(id)
  }

  @Get('/get/dropdown')
  getAllForDropdown() {
    return this.facultyService.getAllForDropdown()
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete('/delete/:facultyId')
  async delete(@Param('facultyId', ParseMongoIdPipe) facultyId: Types.ObjectId) {
    await this.facultyService.delete(facultyId)

    await this.groupService.deleteAllByFacultyId(facultyId)
  }
}
