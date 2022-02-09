import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common'
import { FacultyService } from './faculty.service'
import { CreateFacultyDto } from './dto/createFaculty.dto'
import { QueryOptions, Types } from 'mongoose'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { AdminUserAuth } from '../../global/decorators/AdminUserAuth.decorator'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'
import { IntQueryParam } from '../../global/decorators/IntQueryParam.decorator'
import { StringQueryParam } from '../../global/decorators/StringQueryParam.decorator'

@Controller()
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @AdminUserAuth({
    availability: 'canCreateFaculty',
  })
  @WhitelistedValidationPipe()
  @Post('/')
  create(@Body() dto: CreateFacultyDto) {
    return this.facultyService.create(dto)
  }

  @Get('/by-id')
  async getById(@MongoId('facultyId') facultyId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.facultyService.getById(facultyId, queryOptions)
  }

  @Get('/by-ids')
  async getByIds(
    @MongoId('facultyIds', { multiple: true }) facultyIds: Types.ObjectId[],
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      faculties: await this.facultyService.getByIds(facultyIds, queryOptions),
    }
  }

  @Get('/many')
  async getMany(
    @IntQueryParam('page', { intType: 'positive' }) page: number,
    @IntQueryParam('count', { intType: 'positive' }) count: number,
    @StringQueryParam('title', { required: false }) title?: string,
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
  @WhitelistedValidationPipe()
  @Patch('/')
  async update(@Body() dto: UpdateFacultyDto) {
    await this.facultyService.update(dto)
    return this.facultyService.getById(dto.id)
  }

  @AdminUserAuth({
    availability: 'canDeleteFaculty',
  })
  @Delete('/')
  async delete(@MongoId('facultyId') facultyId: Types.ObjectId) {
    await this.facultyService.delete(facultyId)
  }
}
