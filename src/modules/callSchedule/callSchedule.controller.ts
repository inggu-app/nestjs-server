import { Body, Controller, Delete, Get, HttpStatus, Patch, Post } from '@nestjs/common'
import { CreateCallScheduleDto } from './dto/createCallSchedule.dto'
import { CallScheduleService } from './callSchedule.service'
import { AdminUserAuth } from '../../global/decorators/AdminUserAuth.decorator'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { QueryOptions, Types } from 'mongoose'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { UpdateCallScheduleDto } from './dto/updateCallSchedule.dto'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'
import { StringQueryParam } from '../../global/decorators/StringQueryParam.decorator'
import { FacultyService } from '../faculty/faculty.service'
import { GroupService } from '../group/group.service'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiMongoQueryOptions } from '../../global/decorators/ApiMongoQueryOptions.decorator'
import { CreateResponseDto } from './dto/responses/CreateResponse.dto'
import { ApiResponseException } from '../../global/decorators/ApiResponseException.decorator'
import { GetByIdResponseDto } from './dto/responses/GetByIdResponse.dto'
import { GetByNameResponseDto } from './dto/responses/GetByNameResponse.dto'
import { GetByGroupIdResponseDto } from './dto/responses/GetByGroupIdResponse.dto'
import { GetByFacultyIdResponseDto } from './dto/responses/GetByFacultyIdResponse.dto'
import { GetDefaultScheduleResponseDto } from './dto/responses/GetDefaultScheduleResponse.dto'

@ApiTags('Расписание звонков')
@Controller()
export class CallScheduleController {
  constructor(
    private readonly callScheduleService: CallScheduleService,
    private readonly facultyService: FacultyService,
    private readonly groupService: GroupService
  ) {}

  @AdminUserAuth({
    availability: 'canUpdateCallSchedule',
  })
  @WhitelistedValidationPipe()
  @ApiOperation({
    description:
      'Эндпоинт позволяет создать расписание звонков. В последствии расписание звонков можно будет назначить глобальным или назначить локально факультету или группе.',
  })
  @ApiResponse({
    type: CreateResponseDto,
    status: HttpStatus.CREATED,
  })
  @ApiResponseException()
  @Post('/')
  async create(@Body() dto: CreateCallScheduleDto) {
    return {
      callSchedule: await this.callScheduleService.create(dto),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить расписание звонков по id.',
  })
  @ApiQuery({
    name: 'callScheduleId',
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
    description: 'id расписания звонков, которое нужно получить.',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: GetByIdResponseDto,
    status: HttpStatus.OK,
    description:
      'Возвращаемые поля зависят от переданного параметра projection в query-параметре queryOptions. Если параметр не передаётся, то возвращаются все поля',
  })
  @Get('/by-id')
  async getById(@MongoId('callScheduleId') id: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      callSchedule: await this.callScheduleService.getById(id, queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить расписание звонков по названию.',
  })
  @ApiQuery({
    name: 'callScheduleName',
    example: 'Общее расписание звонков',
    description: 'Название расписания звонков, которое нужно получить.',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: GetByNameResponseDto,
    status: HttpStatus.OK,
    description:
      'Возвращаемые поля зависят от переданного параметра projection в query-параметре queryOptions. Если параметр не передаётся, то возвращаются все поля',
  })
  @Get('/by-name')
  async getByName(@StringQueryParam('callScheduleName') name: string, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      callSchedule: await this.callScheduleService.getByName(name, queryOptions),
    }
  }

  @ApiOperation({
    description:
      'Эндпоинт позволяет получить расписание звонков для группы. Если у группы нет специального расписания звонков, то будет возвращено расписание факультета(если оно есть) или глобальное расписание звонков.',
  })
  @ApiQuery({
    name: 'groupId',
    example: '6203ce8cff1a854919f38314',
    description: 'id группы, для которой нужно получить расписание звонков.',
    type: 'MongoId',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: GetByGroupIdResponseDto,
    status: HttpStatus.OK,
    description:
      'Возвращаемые поля зависят от переданного параметра projection в query-параметре queryOptions. Если параметр не передаётся, то возвращаются все поля',
  })
  @Get('/by-group-id')
  async getByGroupId(@MongoId('groupId') groupId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    const group = await this.groupService.getById(groupId, { projection: { callSchedule: 1, faculty: 1 } })
    if (group.callSchedule)
      return {
        callSchedule: await this.callScheduleService.getById(group.callSchedule as Types.ObjectId, queryOptions),
      }
    const faculty = await this.facultyService.getById(
      group.faculty as Types.ObjectId,
      { projection: { callSchedule: 1 } },
      { checkExistence: { faculty: false } }
    )
    if (faculty.callSchedule)
      return {
        callSchedule: await this.callScheduleService.getById(faculty.callSchedule as Types.ObjectId, queryOptions),
      }
    return {
      callSchedule: await this.callScheduleService.getDefaultSchedule(queryOptions),
    }
  }

  @ApiOperation({
    description:
      'Эндпоинт позволяет получить расписание звонков для факультета. Если у факультета нет специального расписания звонков, то будет возвращено глобальное расписание.',
  })
  @ApiQuery({
    name: 'facultyId',
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
    description: 'id факультета, расписание звонков для которого нужно получить.',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: GetByFacultyIdResponseDto,
    status: HttpStatus.OK,
    description:
      'Возвращаемые поля зависят от переданного параметра projection в query-параметре queryOptions. Если параметр не передаётся, то возвращаются все поля',
  })
  @Get('/by-faculty-id')
  async getByFacultyId(@MongoId('facultyId') facultyId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    const faculty = await this.facultyService.getById(facultyId, { projection: { callSchedule: 1 } })
    if (faculty.callSchedule)
      return {
        callSchedule: await this.callScheduleService.getById(faculty.callSchedule as Types.ObjectId, queryOptions),
      }
    return {
      callSchedule: await this.callScheduleService.getDefaultSchedule(queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить глобальное расписание звонков.',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: GetDefaultScheduleResponseDto,
    status: HttpStatus.OK,
    description:
      'Возвращаемые поля зависят от переданного параметра projection в query-параметре queryOptions. Если параметр не передаётся, то возвращаются все поля',
  })
  @Get('/default')
  async getDefaultSchedule(@MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      callSchedule: await this.callScheduleService.getDefaultSchedule(queryOptions),
    }
  }

  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет обновить расписание звонков.',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch('/')
  async update(@Body() dto: UpdateCallScheduleDto) {
    await this.callScheduleService.update(dto)
  }

  @ApiOperation({
    description:
      'Эндпоинт позволяет установить новое глобальное расписание звонков. Расписание звонков с переданным id станет глобальным, а прошлое перестанет быть глобальным.',
  })
  @ApiQuery({
    name: 'callScheduleId',
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
    description: 'id расписания звонков, которое необходимо сделать глобальным.',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch('/default')
  async updateDefaultSchedule(@MongoId('callScheduleId') id: Types.ObjectId) {
    await this.callScheduleService.updateDefaultSchedule(id)
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет удалить расписание звонков по id.',
  })
  @ApiQuery({
    name: 'callScheduleId',
    type: 'MongoId',
    example: '6203ce8cff1a854919f38314',
    description: 'id расписания звонков, которое необходимо удалить.',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete('/by-id')
  async deleteById(@MongoId('callScheduleId') id: Types.ObjectId) {
    await this.callScheduleService.deleteById(id)
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет удалить расписание звонков по названию.',
  })
  @ApiQuery({
    name: 'callScheduleName',
    example: 'Общее расписание звонков',
    description: 'Название расписания звонков, которое нужно удалить.',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete('/by-name')
  async deleteByName(@StringQueryParam('callScheduleName') name: string) {
    await this.callScheduleService.deleteByName(name)
  }
}
