import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { FacultyService } from './faculty.service'
import { CreateFacultyDto } from './dto/createFaculty.dto'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { GroupService } from '../group/group.service'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'
import { FacultyAdditionalFieldsEnum, FacultyField, FacultyFieldsEnum, FacultyRoutesEnum, GetFacultiesEnum } from './faculty.constants'
import { ParseFieldsPipe } from '../../global/pipes/fields.pipe'
import normalizeFields from '../../global/utils/normalizeFields'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { Fields } from '../../global/decorators/Fields.decorator'

@Controller()
export class FacultyController {
  constructor(private readonly facultyService: FacultyService, private readonly groupService: GroupService) {}

  @Functionality({
    code: FunctionalityCodesEnum.FACULTY__CREATE,
    title: 'Создать факультет',
  })
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
        return normalizeFields(await this.facultyService.getById(request.facultyId, request.fields), {
          fields: request.fields,
        })
      case GetFacultiesEnum.all:
        return {
          faculties: normalizeFields(await this.facultyService.getAll(request.page, request.count, request.title, request.fields), {
            fields: request.fields,
          }),
          count: await this.facultyService.countAll(request.title),
        }
    }
  }

  @Functionality({
    code: FunctionalityCodesEnum.FACULTY__GET_BY_FACULTY_ID,
    title: 'Получить факультет по id',
  })
  @Get(FacultyRoutesEnum.GET_BY_FACULTY_ID)
  async getByFacultyId(
    @Query('facultyId', new ParseMongoIdPipe({ required: false })) facultyId: Types.ObjectId,
    @Fields({ fieldsEnum: FacultyFieldsEnum, additionalFieldsEnum: FacultyAdditionalFieldsEnum }) fields?: FacultyField[]
  ) {
    return normalizeFields(await this.facultyService.getById(facultyId, fields), { fields })
  }

  @Functionality({
    code: FunctionalityCodesEnum.FACULTY__GET_MANY,
    title: 'Получить список факультетов',
  })
  @Get(FacultyRoutesEnum.GET_MANY)
  async getMany(
    @Query('page', new CustomParseIntPipe({ required: false })) page: number,
    @Query('count', new CustomParseIntPipe({ required: false })) count: number,
    @Query('title') title?: string,
    @Fields({ fieldsEnum: FacultyFieldsEnum, additionalFieldsEnum: FacultyAdditionalFieldsEnum }) fields?: FacultyField[]
  ) {
    return {
      faculties: normalizeFields(await this.facultyService.getAll(page, count, title, fields), { fields }),
      count: await this.facultyService.countAll(title),
    }
  }

  @Functionality({
    code: FunctionalityCodesEnum.FACULTY__UPDATE,
    title: 'Обновить информацию по факультету',
  })
  @UsePipes(new ValidationPipe())
  @Patch(FacultyRoutesEnum.UPDATE)
  update(@Body() dto: UpdateFacultyDto) {
    return this.facultyService.update(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.FACULTY__DELETE,
    title: 'Удалить факультет',
  })
  @Delete('/')
  async delete(@Query('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    await this.facultyService.delete(id)

    await this.groupService.deleteAllByFacultyId(id)
  }
}
