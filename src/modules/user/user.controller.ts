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
  get(@MongoId(UserGetQueryParametersEnum.USER_ID) userId: Types.ObjectId, @GetUserFields() fields?: UserField[]) {
    return this.userService.getById(userId, { fields })
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

function GetUserFields() {
  return Fields({
    fieldsEnum: UserFieldsEnum,
    additionalFieldsEnum: UserAdditionalFieldsEnum,
    forbiddenFieldsEnum: UserForbiddenFieldsEnum,
  })
}
