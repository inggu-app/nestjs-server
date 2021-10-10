import { Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common'
import { RoleService } from './role.service'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { RoleAdditionalFieldsEnum, RoleField, RoleFieldsEnum, RoleGetQueryParametersEnum, RoleRoutesEnum } from './role.constants'
import { CreateRoleDto } from './dto/createRole.dto'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { Fields } from '../../global/decorators/Fields.decorator'
import { UpdateRoleDto } from './dto/updateRole.dto'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Functionality({
    code: FunctionalityCodesEnum.ROLE__CREATE,
    title: 'Создать поль',
  })
  @Post(RoleRoutesEnum.CREATE)
  create(dto: CreateRoleDto) {
    return this.roleService.create(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.ROLE__GET_BY_ROLE_ID,
    title: 'Запросить роль по id',
  })
  @Get(RoleRoutesEnum.GET_BY_ROLE_ID)
  getByRoleId(
    @Query(RoleGetQueryParametersEnum.ROLE_ID, new ParseMongoIdPipe()) roleId: Types.ObjectId,
    @Fields({ fieldsEnum: RoleFieldsEnum, additionalFieldsEnum: RoleAdditionalFieldsEnum }) fields?: RoleField[]
  ) {
    return this.roleService.getById(roleId, fields)
  }

  @Functionality({
    code: FunctionalityCodesEnum.ROLE__GET_MANY,
    title: 'Запросить список ролей',
  })
  @Get(RoleRoutesEnum.GET_MANY)
  getMany(@Fields({ fieldsEnum: RoleFieldsEnum, additionalFieldsEnum: RoleAdditionalFieldsEnum }) fields?: RoleField[]) {
    return this.roleService.getMany(fields)
  }

  @Functionality({
    code: FunctionalityCodesEnum.ROLE__UPDATE,
    title: 'Обновить роль',
  })
  @Patch(RoleRoutesEnum.UPDATE)
  update(dto: UpdateRoleDto) {
    return this.roleService.update(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.ROLE__DELETE,
    title: 'Удалить роль',
  })
  @Delete(RoleRoutesEnum.DELETE)
  delete(@Query('roleId', new ParseMongoIdPipe()) roleId: Types.ObjectId) {
    return this.roleService.deleteById(roleId)
  }
}
