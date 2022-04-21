import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Patch, Post } from '@nestjs/common'
import { RoleService } from '../services/role.service'
import { WhitelistedValidationPipe } from '../../../global/decorators/WhitelistedValidationPipe.decorator'
import { CreateRoleDto } from '../dto/role/createRole.dto'
import { ApiResponseException } from '../../../global/decorators/ApiResponseException.decorator'
import { IntQueryParam } from '../../../global/decorators/IntQueryParam.decorator'
import { StringQueryParam } from '../../../global/decorators/StringQueryParam.decorator'
import { MongoQueryOptions } from '../../../global/decorators/MongoQueryOptions.decorator'
import { QueryOptions, Types } from 'mongoose'
import { ApiMongoQueryOptions } from '../../../global/decorators/ApiMongoQueryOptions.decorator'
import { UserModuleCreateRoleResponseDto } from '../dto/role/responses/UserModuleCreateRoleResponse.dto'
import { UserModuleGetManyRolesResponseDto } from '../dto/role/responses/UserModuleGetManyRolesResponse.dto'
import { MongoIdExample, MongoIdType } from '../../../global/constants/constants'
import { UserModuleGetRoleByIdResponseDto } from '../dto/role/responses/UserModuleGetRoleByIdResponse.dto'
import { MongoId } from '../../../global/decorators/MongoId.decorator'
import { UpdateRoleDto } from '../dto/role/updateRole.dto'
import { UserAuth } from '../../../global/decorators/UserAuth.decorator'
import { objectKeys } from '../../../global/utils/objectKeys'
import { RequestUser } from '../../../global/decorators/RequestUser.decorator'
import { UpdateRoleAvailabilityModel } from '../models/user.model'
import { UserModuleGetRolesByIdsResponseDto } from '../dto/role/responses/UserModuleGetRolesByIdsResponse.dto'

@ApiTags('Роли')
@Controller('/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UserAuth({
    availability: 'createRole',
    availabilityKey: 'available',
  })
  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет создать роль',
  })
  @ApiResponseException()
  @ApiResponse({
    type: UserModuleCreateRoleResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post('/')
  async createRole(@Body() dto: CreateRoleDto) {
    return {
      role: await this.roleService.create(dto),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить роль по id',
  })
  @ApiQuery({
    name: 'roleId',
    description: 'id роли',
    type: MongoIdType,
    example: MongoIdExample,
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: UserModuleGetRoleByIdResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/by-id')
  async getRoleById(@MongoId('roleId') roleId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return {
      role: await this.roleService.getById(roleId, queryOptions),
    }
  }

  @ApiOperation({
    description: 'Эндпоинт позволяет получить роли по списку id',
  })
  @ApiQuery({
    name: 'rolesIds',
    description: 'Список id ролей, которых нужно получить. id нужно перечислять через запятую',
    type: MongoIdType,
    isArray: true,
    example: [MongoIdExample],
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: UserModuleGetRolesByIdsResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/by-ids')
  async getRolesByIds(
    @MongoId('rolesIds', { multiple: true }) rolesIds: Types.ObjectId[],
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      roles: await this.roleService.getByIds(rolesIds, queryOptions),
    }
  }

  @ApiOperation({ description: 'Эндпоинт позволяет получить список всех ролей, основываясь на переданных параметрах.' })
  @ApiQuery({
    name: 'page',
    description: 'Страница. Значением параметра может быть только положительное число.',
    example: 1,
  })
  @ApiQuery({
    name: 'count',
    description: 'Количество получаемых ролей. Значением параметра может быть только положительное число.',
    example: 10,
  })
  @ApiQuery({
    name: 'label',
    required: false,
    description:
      'Строка, которая содержится в названии роли. Если параметр передан, то возвращается список только тех ролей, у которых в названии содержится переданная строка. Параметр не чувствителен к регистру(Мин = мин).',
    example: 'Мин',
  })
  @ApiQuery({
    name: 'in',
    description: 'Если передать этот параметр, то в ответ придут только те роли, id которых находятся в переданном списке',
    type: MongoIdType,
    example: [MongoIdExample],
    required: false,
  })
  @ApiMongoQueryOptions()
  @ApiResponseException()
  @ApiResponse({
    type: UserModuleGetManyRolesResponseDto,
    status: HttpStatus.OK,
  })
  @Get('/many')
  async getManyRoles(
    @IntQueryParam('page', { intType: 'positive' }) page: number,
    @IntQueryParam('count', { intType: 'positive' }) count: number,
    @StringQueryParam('label', { required: false }) label?: string,
    @MongoId('in', { multiple: true, required: false }) in_?: Types.ObjectId[],
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      roles: await this.roleService.getMany(page, count, label, queryOptions, in_),
      count: await this.roleService.countMany(label, in_),
    }
  }

  @UserAuth({
    availability: 'updateRole',
    availabilityKey: 'available',
  })
  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет обновить роль',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch('/')
  async update(@Body() dto: UpdateRoleDto, @RequestUser() user: RequestUser<UpdateRoleAvailabilityModel>) {
    // проверяем пытается ли пользователь обновлить недоступные ему поля
    const errors: string[] = []
    const { id, ...fields } = dto
    objectKeys(fields).forEach(field => {
      if (!user.availability.availableFields[field]) errors.push(`Пользователю запрещено редактировать поле ${field}`)
    })
    if (errors.length) throw new BadRequestException(errors)

    // проверяем пытается ли пользователь редактировать недоступные ему роли
    if (!user.availability.all) {
      if (!user.availability.availableRoles.includes(id))
        throw new BadRequestException(`Пользователь не может редактировать роль с id ${id}`)
    }

    await this.roleService.update(dto)
  }

  @UserAuth({
    availability: 'deleteRole',
    availabilityKey: 'available',
  })
  @ApiOperation({
    description: 'Эндпоинт позволяет удалить роль',
  })
  @ApiQuery({
    name: 'roleId',
    description: 'id роли',
    type: MongoIdType,
    example: MongoIdExample,
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Delete('/')
  async deleteById(@MongoId('roleId') roleId: Types.ObjectId) {
    await this.roleService.deleteById(roleId)
  }
}
