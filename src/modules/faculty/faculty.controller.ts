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
import { FacultyService } from './faculty.service'
import { CreateFacultyDto } from './dto/create-faculty.dto'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { GroupService } from '../group/group.service'
import { AdminJwtAuthGuard } from '../../global/guards/adminJwtAuth.guard'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'
import { FacultyField, GetFacultiesEnum } from './faculty.constants'
import { ParseFieldsPipe } from '../../global/pipes/fields.pipe'
import { GroupFieldsEnum } from '../group/group.constants'

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

  @Get('/')
  async get(
    @Query('facultyId', ParseMongoIdPipe) facultyId?: Types.ObjectId,
    @Query('page', CustomParseIntPipe) page?: number,
    @Query('count', CustomParseIntPipe) count?: number,
    @Query('title') title?: string,
    @Query('fields', new ParseFieldsPipe(GroupFieldsEnum)) fields?: FacultyField[]
  ) {
    const request = checkAlternativeQueryParameters<GetFacultiesEnum>(
      { required: { facultyId }, fields, enum: GetFacultiesEnum.facultyId },
      { required: { page, count }, fields, title, enum: GetFacultiesEnum.all }
    )

    switch (request.enum) {
      case GetFacultiesEnum.facultyId:
        return this.facultyService.getById(request.facultyId, request.fields)
      case GetFacultiesEnum.all:
        return {
          faculties: await this.facultyService.getAll(request.page, request.page, request.title),
          count: await this.facultyService.countAll(request.title),
        }
    }
  }

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch('/')
  update(@Body() dto: UpdateFacultyDto) {
    return this.facultyService.update(dto)
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete('/delete/:facultyId')
  async delete(@Param('facultyId', ParseMongoIdPipe) facultyId: Types.ObjectId) {
    await this.facultyService.delete(facultyId)

    await this.groupService.deleteAllByFacultyId(facultyId)
  }
}
