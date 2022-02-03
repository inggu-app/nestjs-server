import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { FacultyService } from './faculty.service'
import { CreateFacultyDto } from './dto/createFaculty.dto'
import { QueryOptions, Types } from 'mongoose'
import { GroupService } from '../group/group.service'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import { FacultyGetQueryParametersEnum, FacultyRoutesEnum } from './faculty.constants'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { ApiTags } from '@nestjs/swagger'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { AdminUserAuth } from '../../global/decorators/AdminUserAuth.decorator'

@ApiTags('Факультеты')
@Controller()
export class FacultyController {
  constructor(private readonly facultyService: FacultyService, private readonly groupService: GroupService) {}

  @AdminUserAuth({
    availability: 'canCreateFaculty',
  })
  @UsePipes(new ValidationPipe())
  @Post('/')
  create(@Body() dto: CreateFacultyDto) {
    return this.facultyService.create(dto)
  }

  @Get(FacultyRoutesEnum.GET_BY_FACULTY_ID)
  async getByFacultyId(
    @MongoId(FacultyGetQueryParametersEnum.FACULTY_ID) facultyId: Types.ObjectId,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return this.facultyService.getById(facultyId, queryOptions)
  }

  @Get(FacultyRoutesEnum.GET_BY_FACULTY_IDS)
  async getByFacultyIds(
    @MongoId(FacultyGetQueryParametersEnum.FACULTY_IDS, { multiple: true }) facultyIds: Types.ObjectId[],
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      faculties: await this.facultyService.getByIds(facultyIds, queryOptions),
    }
  }

  @Get(FacultyRoutesEnum.GET_MANY)
  async getMany(
    @Query(FacultyGetQueryParametersEnum.PAGE, new CustomParseIntPipe({ intType: 'positive' })) page: number,
    @Query(FacultyGetQueryParametersEnum.COUNT, new CustomParseIntPipe({ intType: 'positive' })) count: number,
    @Query(FacultyGetQueryParametersEnum.TITLE) title?: string,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      faculties: await this.facultyService.getAll(page, count, title, queryOptions),
      count: await this.facultyService.countAll(title),
    }
  }

  @AdminUserAuth({
    availability: 'canUpdateFaculty',
  })
  @UsePipes(new ValidationPipe())
  @Patch(FacultyRoutesEnum.UPDATE)
  update(@Body() dto: UpdateFacultyDto) {
    return this.facultyService.update(dto)
  }

  @AdminUserAuth({
    availability: 'canDeleteFaculty',
  })
  @Delete(FacultyRoutesEnum.DELETE)
  async delete(@MongoId('facultyId') facultyId: Types.ObjectId) {
    await this.facultyService.delete(facultyId)

    await this.groupService.deleteAllByFacultyId(facultyId)
  }
}
