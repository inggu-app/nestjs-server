import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { FacultyService } from './faculty.service'
import { CreateFacultyDto } from './dto/createFaculty.dto'
import { Types } from 'mongoose'
import { GroupService } from '../group/group.service'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import {
  defaultFacultyCreateData,
  defaultFacultyDeleteData,
  defaultFacultyGetByFacultyIdData,
  defaultFacultyGetManyData,
  defaultFacultyUpdateData,
  FacultyAdditionalFieldsEnum,
  FacultyField,
  FacultyFieldsEnum,
  FacultyGetQueryParametersEnum,
  FacultyRoutesEnum,
} from './faculty.constants'
import normalizeFields from '../../global/utils/normalizeFields'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { Fields } from '../../global/decorators/Fields.decorator'
import { MongoId } from '../../global/decorators/MongoId.decorator'

@Controller()
export class FacultyController {
  constructor(private readonly facultyService: FacultyService, private readonly groupService: GroupService) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.FACULTY__CREATE,
    default: defaultFacultyCreateData,
    title: 'Создать факультет',
  })
  @Post('/')
  create(@Body() dto: CreateFacultyDto) {
    return this.facultyService.create(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.FACULTY__GET_BY_FACULTY_ID,
    default: defaultFacultyGetByFacultyIdData,
    title: 'Получить факультет по id',
  })
  @Get(FacultyRoutesEnum.GET_BY_FACULTY_ID)
  async getByFacultyId(
    @MongoId(FacultyGetQueryParametersEnum.FACULTY_ID) facultyId: Types.ObjectId,
    @GetFacultyFields() fields?: FacultyField[]
  ) {
    return normalizeFields(await this.facultyService.getById(facultyId, fields), { fields })
  }

  @Functionality({
    code: FunctionalityCodesEnum.FACULTY__GET_MANY,
    default: defaultFacultyGetManyData,
    title: 'Получить список факультетов',
  })
  @Get(FacultyRoutesEnum.GET_MANY)
  async getMany(
    @Query(FacultyGetQueryParametersEnum.PAGE, new CustomParseIntPipe()) page: number,
    @Query(FacultyGetQueryParametersEnum.COUNT, new CustomParseIntPipe()) count: number,
    @Query(FacultyGetQueryParametersEnum.TITLE) title?: string,
    @GetFacultyFields() fields?: FacultyField[]
  ) {
    return {
      faculties: normalizeFields(await this.facultyService.getAll(page, count, title, fields), { fields }),
      count: await this.facultyService.countAll(title),
    }
  }

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.FACULTY__UPDATE,
    default: defaultFacultyUpdateData,
    title: 'Обновить информацию по факультету',
  })
  @Patch(FacultyRoutesEnum.UPDATE)
  update(@Body() dto: UpdateFacultyDto) {
    return this.facultyService.update(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.FACULTY__DELETE,
    default: defaultFacultyDeleteData,
    title: 'Удалить факультет',
  })
  @Delete('/')
  async delete(@MongoId('facultyId') facultyId: Types.ObjectId) {
    await this.facultyService.delete(facultyId)

    await this.groupService.deleteAllByFacultyId(facultyId)
  }
}

function GetFacultyFields() {
  return Fields({ fieldsEnum: FacultyFieldsEnum, additionalFieldsEnum: FacultyAdditionalFieldsEnum })
}
