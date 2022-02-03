import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/createUser.dto'
import { QueryOptions, Types } from 'mongoose'
import { UpdateUserDto } from './dto/updateUser.dto'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import {
  defaultUserCreateData,
  defaultUserDeleteData,
  defaultUserGetByRoleIdData,
  defaultUserGetByUserIdData,
  defaultUserGetManyData,
  defaultUserUpdateData,
  UserGetManyDataForFunctionality,
  UserGetQueryParametersEnum,
  UserRoutesEnum,
} from './user.constants'
import { LoginUserDto } from './dto/loginUser.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { ApiTags } from '@nestjs/swagger'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import { CustomRequest } from '../../global/guards/baseJwtAuth.guard'
import { RoleDto } from './dto/role.dto'
import { ObjectValidationPipe } from '../../global/pipes/objectValidation.pipe'
import { MongoQueryOptions } from '../../global/decorators/MongoQueryOptions.decorator'

@ApiTags('Пользователи')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.USER__CREATE,
    default: defaultUserCreateData,
    title: 'Создать пользователя',
  })
  @Post(UserRoutesEnum.CREATE)
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.USER__GET_BY_USER_ID,
    default: defaultUserGetByUserIdData,
    title: 'Получить пользователя по id',
  })
  @Get(UserRoutesEnum.GET_BY_USER_ID)
  getByUserId(@MongoId(UserGetQueryParametersEnum.USER_ID) userId: Types.ObjectId, @MongoQueryOptions() queryOptions?: QueryOptions) {
    return this.userService.getById(userId, { queryOptions })
  }

  @Functionality({
    code: FunctionalityCodesEnum.USER__GET_BY_ROLE_ID,
    default: defaultUserGetByRoleIdData,
    title: 'Получить пользователя по id роли',
  })
  @Get(UserRoutesEnum.GET_BY_ROLE_ID)
  async getByRoleId(
    @MongoId(UserGetQueryParametersEnum.USER_ID) userId: Types.ObjectId,
    @MongoId(UserGetQueryParametersEnum.ROLE_ID) roleId: Types.ObjectId,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      ...(await this.userService.getById(userId, { queryOptions })),
      ...(await this.userService.getByRoleId(userId, roleId)),
    }
  }

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.USER__GET_MANY,
    default: defaultUserGetManyData,
    title: 'Получить список пользователей',
  })
  @Get(UserRoutesEnum.GET_MANY)
  async getMany(
    @Query(UserGetQueryParametersEnum.PAGE, new CustomParseIntPipe()) page: number,
    @Query(UserGetQueryParametersEnum.COUNT, new CustomParseIntPipe()) count: number,
    @Req() { functionality }: CustomRequest<any, UserGetManyDataForFunctionality>,
    @Query(
      UserGetQueryParametersEnum.ROLES,
      new ObjectValidationPipe({ isArray: true, dto: RoleDto, parameterName: UserGetQueryParametersEnum.ROLES, required: false })
    )
    roles?: RoleDto[],
    @Query(UserGetQueryParametersEnum.NAME) name?: string,
    @MongoQueryOptions() queryOptions?: QueryOptions
  ) {
    return {
      users: await this.userService.getMany({ page, count, name, roles }, { functionality, queryOptions }),
      count: await this.userService.countAll({ name, roles }, { functionality }),
    }
  }

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.USER__UPDATE,
    default: defaultUserUpdateData,
    title: 'Обновить пользователя',
  })
  @Patch(UserRoutesEnum.UPDATE)
  update(@Body() dto: UpdateUserDto) {
    return this.userService.update(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.USER__DELETE,
    default: defaultUserDeleteData,
    title: 'Удалить пользователя',
  })
  @Delete(UserRoutesEnum.DELETE)
  delete(@MongoId('userId') userId: Types.ObjectId) {
    return this.userService.delete(userId)
  }

  @UsePipes(new ValidationPipe())
  @Post(UserRoutesEnum.LOGIN)
  login(@Body() dto: LoginUserDto) {
    return this.userService.login(dto)
  }
}
