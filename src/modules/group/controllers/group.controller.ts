import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Patch, Post } from '@nestjs/common'
import { GroupService } from '../services/group.service'
import { CreateGroupDto } from '../dto/group/createGroup.dto'
import { QueryOptions, Types } from 'mongoose'
import { UpdateGroupDto } from '../dto/group/updateGroup.dto'
import { MongoId } from '../../../global/decorators/MongoId.decorator'
import { MongoQueryOptions } from '../../../global/decorators/MongoQueryOptions.decorator'
import { UserAuth } from '../../../global/decorators/UserAuth.decorator'
import { WhitelistedValidationPipe } from '../../../global/decorators/WhitelistedValidationPipe.decorator'
import { IntQueryParam } from '../../../global/decorators/IntQueryParam.decorator'
import { StringQueryParam } from '../../../global/decorators/StringQueryParam.decorator'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApiResponseException } from '../../../global/decorators/ApiResponseException.decorator'
import { GroupModuleCreateResponseDto } from '../dto/group/responses/GroupModuleCreateResponseDto'
import { MongoIdExample, MongoIdType } from '../../../global/constants/constants'
import { ApiMongoQueryOptions } from '../../../global/decorators/ApiMongoQueryOptions.decorator'
import { GroupModuleGetByIdResponseDto } from '../dto/group/responses/GroupModuleGetByIdResponseDto'
import { GroupModuleGetByIdsResponseDto } from '../dto/group/responses/GroupModuleGetByIdsResponseDto'
import { GroupModuleGetByFacultyIdResponseDto } from '../dto/group/responses/GroupModuleGetByFacultyIdResponseDto'
import { GroupModuleGetManyResponseDto } from '../dto/group/responses/GroupModuleGetManyResponseDto'
import { RequestUser } from '../../../global/decorators/RequestUser.decorator'
import { CreateGroupAvailabilityModel, DeleteGroupAvailabilityModel, UpdateGroupAvailabilityModel } from '../../user/models/user.model'
import { objectKeys } from '../../../global/utils/objectKeys'
import { GroupModel } from '../group.model'

@ApiTags('Группы')
@Controller()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UserAuth({
    availability: 'createGroup',
    availabilityKey: 'available',
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
  async create(@Body() dto: CreateGroupDto, @RequestUser() user: RequestUser<CreateGroupAvailabilityModel>) {
    if (!user.availability.allFaculties) {
      if (!user.availability.availableFaculties.includes(dto.faculty))
        throw new BadRequestException('Пользователю запрещено создавать группы для этого факультета')
    }

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
  async getById(@MongoId('groupId') groupId: Types.ObjectId, @MongoQueryOptions<GroupModel>(['faculty']) queryOptions?: QueryOptions) {
    return this.groupService.getById(groupId, queryOptions)
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить список групп по переданному списку id',
  })
  @ApiQuery({
    name: 'groupsIds',
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
  async getByIds(
    @MongoId('groupsIds', { multiple: true }) groupIds: Types.ObjectId[],
    @MongoQueryOptions<GroupModel>(['faculty']) queryOptions?: QueryOptions
  ) {
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
  private async getByFacultyId(
    @MongoId('facultyId') facultyId: Types.ObjectId,
    @MongoQueryOptions<GroupModel>(['faculty']) queryOptions?: QueryOptions
  ) {
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
    @MongoQueryOptions<GroupModel>(['faculty']) queryOptions?: QueryOptions
  ) {
    return {
      groups: await this.groupService.getMany(page, count, title, queryOptions),
      count: await this.groupService.countMany(title),
    }
  }

  @UserAuth({
    availability: 'updateGroup',
    availabilityKey: 'available',
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
  async update(@Body() dto: UpdateGroupDto, @RequestUser() user: RequestUser<UpdateGroupAvailabilityModel>) {
    // Проверяем пытается ли пользователь обновить поля, которые ему недоступны
    const availableFields = user.availability.availableFields
    const errors: string[] = []
    const { id, ...fields } = dto
    objectKeys(fields).forEach(field => {
      if (!availableFields[field]) errors.push(`Пользователю запрещено редактировать поле ${field} у группы`)
    })
    if (errors.length) throw new BadRequestException(errors)

    // Проверяем пытается ли пользователь обновить недоступную ему группу
    if (user.availability.forbiddenGroups.includes(id)) throw new BadRequestException(`Пользователю запрещено обновлять группу с id ${id}`)
    if (!user.availability.allForUpdate) {
      if (!user.availability.availableGroups.includes(id)) {
        const group = await this.groupService.getById(id, { projection: { faculty: 1 } })
        if (!user.availability.availableForUpdateFaculties.includes(group.faculty))
          throw new BadRequestException(`Пользователю запрещено обновлять группу с id ${id}`)
      }
    }

    // Проверяем пытается ли пользователь обновить принадлежность группы к запрещённому ему факультету
    if (dto.faculty) {
      if (!user.availability.allFacultiesForInstallation) {
        if (!user.availability.availableForInstallationFaculties.includes(dto.faculty))
          throw new BadRequestException(
            `Пользователю запрещено обновлять принадлежность группы к факультету на факультет с id ${dto.faculty}`
          )
      }
    }

    await this.groupService.update(dto)
  }

  @UserAuth({
    availability: 'deleteGroup',
    availabilityKey: 'available',
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
  async delete(@MongoId('groupId') groupId: Types.ObjectId, @RequestUser() user: RequestUser<DeleteGroupAvailabilityModel>) {
    if (user.availability.forbiddenGroups.includes(groupId))
      throw new BadRequestException(`Пользователь не может удалить группу с id ${groupId}`)
    if (!user.availability.all) {
      if (!user.availability.availableGroups.includes(groupId)) {
        const group = await this.groupService.getById(groupId, { projection: { faculty: 1 } })
        if (!user.availability.availableFaculties.includes(group.faculty))
          throw new BadRequestException(`Пользователь не может удалить группу с id ${groupId}`)
      }
    }

    await this.groupService.delete(groupId)
  }
}
