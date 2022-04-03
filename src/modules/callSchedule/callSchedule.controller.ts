import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Patch, Post } from '@nestjs/common'
import { CreateCallScheduleDto } from './dto/createCallSchedule.dto'
import { CallScheduleService } from './callSchedule.service'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { QueryOptions, Types } from 'mongoose'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { UpdateCallScheduleDto } from './dto/updateCallSchedule.dto'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'
import { FacultyService } from '../faculty/faculty.service'
import { GroupService } from '../group/group.service'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiMongoQueryOptions } from '../../global/decorators/ApiMongoQueryOptions.decorator'
import { CallScheduleModuleCreateResponseDto } from './dto/responses/CallScheduleModuleCreateResponseDto'
import { ApiResponseException } from '../../global/decorators/ApiResponseException.decorator'
import { CallScheduleModuleGetByIdResponseDto } from './dto/responses/CallScheduleModuleGetByIdResponseDto'
import { CallScheduleModuleGetByGroupIdResponseDto } from './dto/responses/CallScheduleModuleGetByGroupIdResponseDto'
import { CallScheduleModuleGetByFacultyIdResponseDto } from './dto/responses/CallScheduleModuleGetByFacultyIdResponseDto'
import { CallScheduleModuleGetDefaultScheduleResponseDto } from './dto/responses/CallScheduleModuleGetDefaultScheduleResponseDto'
import { UserAuth } from '../../global/decorators/UserAuth.decorator'
import { RequestUser } from '../../global/decorators/RequestUser.decorator'
import { DeleteCallScheduleAvailabilityModel, UpdateCallScheduleAvailabilityModel } from '../user/models/user.model'
import { objectKeys } from '../../global/utils/objectKeys'

@ApiTags('Расписание звонков')
@Controller()
export class CallScheduleController {
  constructor(
    private readonly callScheduleService: CallScheduleService,
    private readonly facultyService: FacultyService,
    private readonly groupService: GroupService
  ) {}

  @UserAuth({
    availability: 'createCallSchedule',
    availabilityKey: 'available',
  })
  @WhitelistedValidationPipe()
  @ApiOperation({
    description:
      'Эндпоинт позволяет создать расписание звонков. В последствии расписание звонков можно будет назначить глобальным или назначить локально факультету или группе.',
  })
  @ApiResponse({
    type: CallScheduleModuleCreateResponseDto,
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
    type: CallScheduleModuleGetByIdResponseDto,
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
    type: CallScheduleModuleGetByGroupIdResponseDto,
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
    type: CallScheduleModuleGetByFacultyIdResponseDto,
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
    type: CallScheduleModuleGetDefaultScheduleResponseDto,
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

  @UserAuth({
    availability: 'updateCallSchedule',
    availabilityKey: 'available',
  })
  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет обновить расписание звонков.',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch('/')
  async update(@Body() dto: UpdateCallScheduleDto, @RequestUser() user: RequestUser<UpdateCallScheduleAvailabilityModel>) {
    // проверяем пытается ли пользователь редактировать недоступные ему поля
    const availableFields = user.availability.availableFields
    const errors: string[] = []
    const { id, ...fields } = dto
    objectKeys(fields).forEach(field => {
      if (!availableFields[field]) errors.push(`Пользователю запрещено редактировать поле ${field} у расписания звонков`)
    })
    if (errors.length) throw new BadRequestException(errors)

    // проверяем пытается ли пользователь редактировать недоступные ему расписания звонков
    if (!user.availability.all) {
      if (!user.availability.availableCallSchedules.includes(id))
        throw new BadRequestException(`Пользователю запрещено редактирвоать расписание звонков с id ${id}`)
    }
    await this.callScheduleService.update(dto)
  }

  @UserAuth({
    availability: 'deleteCallSchedule',
    availabilityKey: 'available',
  })
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
  async deleteById(
    @MongoId('callScheduleId') callScheduleId: Types.ObjectId,
    @RequestUser() user: RequestUser<DeleteCallScheduleAvailabilityModel>
  ) {
    if (!user.availability.all) {
      if (!user.availability.availableCallSchedules.includes(callScheduleId))
        throw new BadRequestException(`Пользователь не может удалить расписание звонков с id ${callScheduleId}`)
    }

    await this.callScheduleService.deleteById(callScheduleId)
  }
}
