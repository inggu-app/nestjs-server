import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common'
import { RoleService } from '../services/role.service'
import { WhitelistedValidationPipe } from '../../../global/decorators/WhitelistedValidationPipe.decorator'
import { CreateRoleDto } from '../dto/role/createRole.dto'
import { ApiResponseException } from '../../../global/decorators/ApiResponseException.decorator'
import { IntQueryParam } from '../../../global/decorators/IntQueryParam.decorator'
import { StringQueryParam } from '../../../global/decorators/StringQueryParam.decorator'
import { MongoQueryOptions } from '../../../global/decorators/MongoQueryOptions.decorator'
import { QueryOptions } from 'mongoose'
import { ApiMongoQueryOptions } from '../../../global/decorators/ApiMongoQueryOptions.decorator'
import { UserModuleCreateRoleResponseDto } from '../dto/role/responses/UserModuleCreateRoleResponse.dto'
import { UserModuleGetManyRolesResponseDto } from '../dto/role/responses/UserModuleGetManyRolesResponse.dto'

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
}
