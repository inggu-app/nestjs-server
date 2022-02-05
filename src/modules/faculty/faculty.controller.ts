import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common'
import { FacultyService } from './faculty.service'
import { CreateFacultyDto } from './dto/createFaculty.dto'
import { QueryOptions, Types } from 'mongoose'
import { UpdateFacultyDto } from './dto/updateFaculty.dto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { AdminUserAuth } from '../../global/decorators/AdminUserAuth.decorator'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'

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
    @Query('page', new CustomParseIntPipe({ intType: 'positive' })) page: number,
    @Query('count', new CustomParseIntPipe({ intType: 'positive' })) count: number,
    @Query('title') title?: string,
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
  update(@Body() dto: UpdateFacultyDto) {
    return this.facultyService.update(dto)
  }

  @AdminUserAuth({
    availability: 'canDeleteFaculty',
  })
  @Delete('/')
  async delete(@MongoId('facultyId') facultyId: Types.ObjectId) {
    await this.facultyService.delete(facultyId)
  }
}
