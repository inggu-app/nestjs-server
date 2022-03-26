import { Body, Controller, Delete, Get, HttpStatus, Patch, Post } from '@nestjs/common'
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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiResponseException } from '../../global/decorators/ApiResponseException.decorator'
import { CreateResponseDto } from './dto/responses/CreateResponse.dto'
import { MongoIdExample, MongoIdType } from '../../global/constants/constants'
import { ApiMongoQueryOptions } from '../../global/decorators/ApiMongoQueryOptions.decorator'
import { GetByIdResponseDto } from './dto/responses/GetByIdResponse.dto'
import { GetByIdsResponseDto } from './dto/responses/GetByIdsResponse.dto'
import { GetManyResponseDto } from './dto/responses/GetManyResponse.dto'

@ApiTags('Факультеты')
@Controller()
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @AdminUserAuth({
    availability: 'canCreateFaculty',
  })
  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет создать факультет',
  })
  @ApiResponseException()
  @ApiResponse({
    type: CreateResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post('/')
  async create(@Body() dto: CreateFacultyDto) {
    return {
      faculty: await this.facultyService.create(dto),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить факультет по id',
  })
  @ApiQuery({
    name: 'facultyId',
    description: 'id факультета',
    type: MongoIdType,
    example: MongoIdExample,
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: GetByIdResponseDto,
    description:
      'Возвращаемые поля зависят от переданного параметра projection в query-параметре queryOptions. Если параметр не передаётся, то возвращаются все поля',
    status: HttpStatus.OK,
  })
  @Get('/by-id')
  async getById(@MongoId('facultyId') facultyId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      faculty: await this.facultyService.getById(facultyId, queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить список факультетов по переданному списку id',
  })
  @ApiQuery({
    name: 'facultyIds',
    type: MongoIdType,
    example: [MongoIdExample, MongoIdExample].join(),
    isArray: true,
    description: 'Список id факультетов',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: GetByIdsResponseDto,
    status: HttpStatus.OK,
    description:
      'Возвращаемые поля зависят от переданного параметра projection в query-параметре queryOptions. Если параметр не передаётся, то возвращаются все поля',
  })
  @Get('/by-ids')
  async getByIds(
    @MongoId('facultyIds', { multiple: true }) facultyIds: Types.ObjectId[],
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      faculties: await this.facultyService.getByIds(facultyIds, queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить список факультетов постранично',
  })
  @ApiQuery({
    name: 'page',
    description: 'Страница',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'count',
    description: 'Количество факультетов за раз',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'title',
    description:
      'Название факультета. Если параметр передан, то будут возвращаться группы, в названии которых есть переданное значение. Регистр не важен.',
    type: String,
    example: 'Факульт',
    required: false,
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: GetManyResponseDto,
    status: HttpStatus.OK,
    description:
      'Возвращаемые поля зависят от переданного параметра projection в query-параметре queryOptions. Если параметр не передаётся, то возвращаются все поля',
  })
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
  @ApiOperation({
    description:
      'Эндпоинт позволяет обновить информацию о факультете. В теле запроса нужно передавать только те поля, которые нужно изменить',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch('/')
  async update(@Body() dto: UpdateFacultyDto) {
    await this.facultyService.update(dto)
  }

  @AdminUserAuth({
    availability: 'canDeleteFaculty',
  })
  @ApiOperation({
    description: 'Эндпоинт позволяет удалить факультет',
  })
  @ApiQuery({
    name: 'facultyId',
    description: 'id факультета',
    type: MongoIdType,
    example: MongoIdExample,
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete('/')
  async delete(@MongoId('facultyId') facultyId: Types.ObjectId) {
    await this.facultyService.delete(facultyId)
  }
}
