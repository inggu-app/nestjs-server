import { Body, Controller, Delete, Get, Patch, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common'
import { RoleService } from './role.service'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import {
  defaultRoleCreateData,
  defaultRoleDeleteData,
  defaultRoleGetByRoleIdData,
  defaultRoleGetManyData,
  defaultRoleUpdateData,
  RoleGetManyDataForFunctionality,
  RoleGetQueryParametersEnum,
  RoleRoutesEnum,
} from './role.constants'
import { CreateRoleDto } from './dto/createRole.dto'
import { QueryOptions, Types } from 'mongoose'
import { UpdateRoleDto } from './dto/updateRole.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { CustomRequest } from '../../global/guards/baseJwtAuth.guard'
import { ApiTags } from '@nestjs/swagger'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'

@ApiTags('Роли')
@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.ROLE__CREATE,
    default: defaultRoleCreateData,
    title: 'Создать роль',
  })
  @Post(RoleRoutesEnum.CREATE)
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.ROLE__GET_BY_ROLE_ID,
    default: defaultRoleGetByRoleIdData,
    title: 'Запросить роль по id',
  })
  @Get(RoleRoutesEnum.GET_BY_ROLE_ID)
  getByRoleId(@MongoId(RoleGetQueryParametersEnum.ROLE_ID) roleId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.roleService.getById(roleId, { queryOptions })
  }

  @Functionality({
    code: FunctionalityCodesEnum.ROLE__GET_MANY,
    default: defaultRoleGetManyData,
    title: 'Запросить список ролей',
  })
  @Get(RoleRoutesEnum.GET_MANY)
  async getMany(
    @Req() { functionality }: CustomRequest<any, RoleGetManyDataForFunctionality>,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      roles: await this.roleService.getMany({ functionality, queryOptions }),
      count: await this.roleService.countMany({ functionality }),
    }
  }

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.ROLE__UPDATE,
    default: defaultRoleUpdateData,
    title: 'Обновить роль',
  })
  @Patch(RoleRoutesEnum.UPDATE)
  update(@Body() dto: UpdateRoleDto) {
    return this.roleService.update(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.ROLE__DELETE,
    default: defaultRoleDeleteData,
    title: 'Удалить роль',
  })
  @Delete(RoleRoutesEnum.DELETE)
  delete(@MongoId('roleId') roleId: Types.ObjectId) {
    return this.roleService.deleteById(roleId)
  }
}
