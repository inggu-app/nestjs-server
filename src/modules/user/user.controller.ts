import { Body, Controller, Delete, Get, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/createUser.dto'
import { Types } from 'mongoose'
import { UpdateUserDto } from './dto/updateUser.dto'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import {
  defaultUserCreateData,
  defaultUserDeleteData,
  defaultUserGetByRoleIdData,
  defaultUserGetByUserIdData,
  defaultUserUpdateData,
  UserAdditionalFieldsEnum,
  UserField,
  UserFieldsEnum,
  UserForbiddenFieldsEnum,
  UserGetQueryParametersEnum,
  UserRoutesEnum,
} from './user.constants'
import { Fields } from '../../global/decorators/Fields.decorator'
import { LoginUserDto } from './dto/loginUser.dto'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import normalizeFields from '../../global/utils/normalizeFields'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { objectWithKeys } from '../../global/utils/objectWithKeys'
import { getEnumValues } from '../../global/utils/enumKeysValues'
import { ApiTags } from '@nestjs/swagger'

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
  getByUserId(@MongoId(UserGetQueryParametersEnum.USER_ID) userId: Types.ObjectId, @GetUserFields() fields?: UserField[]) {
    return this.userService.getById(userId, { fields })
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
    @GetUserFields({ forbiddenFields: ['roles'] }) fields?: UserField[]
  ) {
    return {
      ...normalizeFields(await this.userService.getById(userId, { fields: fieldsArrayToProjection(fields, undefined, ['roles']) }), {
        fields,
        forbiddenFields: ['roles', ...getEnumValues(UserForbiddenFieldsEnum)],
      }),
      ...(await this.userService.getByRoleId(userId, roleId)),
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

function GetUserFields(options: { forbiddenFields?: string[] } = { forbiddenFields: [] }) {
  return Fields({
    fieldsEnum: UserFieldsEnum,
    additionalFieldsEnum: UserAdditionalFieldsEnum,
    forbiddenFieldsEnum: {
      ...UserForbiddenFieldsEnum,
      ...(options.forbiddenFields ? objectWithKeys(options.forbiddenFields, ...options.forbiddenFields) : {}),
    },
  })
}
