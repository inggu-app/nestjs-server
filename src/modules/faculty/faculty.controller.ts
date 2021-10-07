import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { FacultyService } from './faculty.service'
import { CreateFacultyDto } from './dto/createFaculty.dto'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { GroupService } from '../group/group.service'
import { AdminJwtAuthGuard } from '../../global/guards/adminJwtAuth.guard'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'
import {
  FacultyAdditionalFieldsEnum,
  FacultyField,
  FacultyFieldsEnum,
  GetFacultiesEnum,
} from './faculty.constants'
import { ParseFieldsPipe } from '../../global/pipes/fields.pipe'
import normalizeFields from '../../global/utils/normalizeFields'

@Controller()
export class FacultyController {
  constructor(
    private readonly facultyService: FacultyService,
    private readonly groupService: GroupService
  ) {}

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/')
  create(@Body() dto: CreateFacultyDto) {
    return this.facultyService.create(dto)
  }

  @Get('/')
  async get(
    @Query('facultyId', new ParseMongoIdPipe({ required: false })) facultyId?: Types.ObjectId,
    @Query('page', new CustomParseIntPipe({ required: false })) page?: number,
    @Query('count', new CustomParseIntPipe({ required: false })) count?: number,
    @Query('title') title?: string,
    @Query(
      'fields',
      new ParseFieldsPipe({
        fieldsEnum: FacultyFieldsEnum,
        additionalFieldsEnum: FacultyAdditionalFieldsEnum,
      })
    )
    fields?: FacultyField[]
  ) {
    const request = checkAlternativeQueryParameters<GetFacultiesEnum>(
      { required: { facultyId }, fields, enum: GetFacultiesEnum.facultyId },
      { required: { page, count }, fields, title, enum: GetFacultiesEnum.all }
    )

    switch (request.enum) {
      case GetFacultiesEnum.facultyId:
        return normalizeFields(
          await this.facultyService.getById(request.facultyId, request.fields),
          {
            fields: request.fields,
          }
        )
      case GetFacultiesEnum.all:
        return {
          faculties: normalizeFields(
            await this.facultyService.getAll(
              request.page,
              request.count,
              request.title,
              request.fields
            ),
            { fields: request.fields }
          ),
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
  @Delete('/')
  async delete(@Query('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    await this.facultyService.delete(id)

    await this.groupService.deleteAllByFacultyId(id)
  }
}
