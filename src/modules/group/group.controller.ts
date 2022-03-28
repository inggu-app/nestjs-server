import { Body, Controller, Delete, Get, HttpStatus, Patch, Post } from '@nestjs/common'
import { GroupService } from './group.service'
import { CreateGroupDto } from './dto/createGroup.dto'
import { QueryOptions, Types } from 'mongoose'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'
import { AdminUserAuth } from '../../global/decorators/AdminUserAuth.decorator'
import { WhitelistedValidationPipe } from '../../global/decorators/WhitelistedValidationPipe.decorator'
import { IntQueryParam } from '../../global/decorators/IntQueryParam.decorator'
import { StringQueryParam } from '../../global/decorators/StringQueryParam.decorator'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiResponseException } from '../../global/decorators/ApiResponseException.decorator'
import { GroupModuleCreateResponseDto } from './dto/responses/GroupModuleCreateResponseDto'
import { MongoIdExample, MongoIdType } from '../../global/constants/constants'
import { ApiMongoQueryOptions } from '../../global/decorators/ApiMongoQueryOptions.decorator'
import { GroupModuleGetByIdResponseDto } from './dto/responses/GroupModuleGetByIdResponseDto'
import { GroupModuleGetByIdsResponseDto } from './dto/responses/GroupModuleGetByIdsResponseDto'
import { GroupModuleGetByFacultyIdResponseDto } from './dto/responses/GroupModuleGetByFacultyIdResponseDto'
import { GroupModuleGetManyResponseDto } from './dto/responses/GroupModuleGetManyResponseDto'

@ApiTags('Группы')
@Controller()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @AdminUserAuth({
    availability: 'canCreateGroup',
  })
  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет создать группу',
  })
  @ApiResponseException()
  @ApiResponse({
    type: GroupModuleCreateResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post('/')
  async create(@Body() dto: CreateGroupDto) {
    return {
      group: await this.groupService.create(dto),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить группу по id',
  })
  @ApiQuery({
    name: 'groupId',
    type: MongoIdType,
    example: MongoIdExample,
    description: 'id группы',
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: GroupModuleGetByIdResponseDto,
    description:
      'Возвращаемые поля зависят от переданного параметра projection в query-параметре queryOptions. Если параметр не передаётся, то возвращаются все поля',
    status: HttpStatus.OK,
  })
  @Get('/by-id')
  async getById(@MongoId('groupId') groupId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.groupService.getById(groupId, queryOptions)
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить список групп по переданному списку id',
  })
  @ApiQuery({
    name: 'groupIds',
    description: 'Список id групп, которые нужно получить',
    type: MongoIdType,
    example: [MongoIdExample, MongoIdExample].join(),
    isArray: true,
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: GroupModuleGetByIdsResponseDto,
    status: HttpStatus.OK,
    description:
      'Возвращаемые поля зависят от переданного параметра projection в query-параметре queryOptions. Если параметр не передаётся, то возвращаются все поля',
  })
  @Get('/by-ids')
  async getByIds(@MongoId('groupIds', { multiple: true }) groupIds: Types.ObjectId[], @MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      groups: await this.groupService.getByGroupIds(groupIds, queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить список групп, привязанных к переданному id факультета',
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
    type: GroupModuleGetByFacultyIdResponseDto,
    status: HttpStatus.OK,
    description:
      'Возвращаемые поля зависят от переданного параметра projection в query-параметре queryOptions. Если параметр не передаётся, то возвращаются все поля',
  })
  @Get('/by-faculty-id')
  private async getByFacultyId(@MongoId('facultyId') facultyId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      groups: await this.groupService.getByFacultyId(facultyId, queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить список всех групп постранично',
  })
  @ApiQuery({
    name: 'page',
    description: 'Страница получаемого списка',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'count',
    description: 'Количество получаемых групп',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'title',
    description:
      'Название группы. Если параметр передан, то будут возвращаться группы, в названии которых есть переданное значение. Регистр не важен.',
    type: String,
    example: 'гру',
    required: false,
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: GroupModuleGetManyResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/many')
  private async getMany(
    @IntQueryParam('page', { intType: 'positive' }) page: number,
    @IntQueryParam('count', { intType: 'positive' }) count: number,
    @StringQueryParam('title', { required: false }) title?: string,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      groups: await this.groupService.getMany(page, count, title, queryOptions),
      count: await this.groupService.countMany(title),
    }
  }

  @AdminUserAuth({
    availability: 'canUpdateGroup',
  })
  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет обновить информацию о группе. В теле нужно передавать только те поля, которые нужно обновить',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch('/')
  async update(@Body() dto: UpdateGroupDto) {
    await this.groupService.update(dto)
  }

  @AdminUserAuth({
    availability: 'canDeleteGroup',
  })
  @ApiOperation({
    description: 'Эндпоинт позволяет удалить группу по переданному id',
  })
  @ApiQuery({
    name: 'groupId',
    type: MongoIdType,
    example: MongoIdExample,
    description: 'id группы',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete('/')
  async delete(@MongoId('groupId') groupId: Types.ObjectId) {
    await this.groupService.delete(groupId)
  }
}
