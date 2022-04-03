import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Delete, Get, HttpStatus, Patch, Post } from '@nestjs/common'
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

@ApiTags('Роли')
@Controller('/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

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
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      roles: await this.roleService.getMany(page, count, label, queryOptions),
      count: await this.roleService.countMany(label),
    }
  }

  @WhitelistedValidationPipe()
  @ApiOperation({
    description: 'Эндпоинт позволяет обновить роль',
  })
  @ApiResponseException()
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch('/')
  async update(@Body() dto: UpdateRoleDto) {
    await this.roleService.update(dto)
  }

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
