import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/createUser.dto'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { UpdateUserDto } from './dto/updateUser.dto'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import {
  UserAdditionalFieldsEnum,
  UserField,
  UserFieldsEnum,
  UserForbiddenFieldsEnum,
  UserGetQueryParametersEnum,
  UserRoutesEnum,
} from './user.constants'
import { Fields } from '../../global/decorators/Fields.decorator'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.USER__CREATE,
    title: 'Создать пользователя',
  })
  @Post(UserRoutesEnum.CREATE)
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.USER__GET_BY_USER_ID,
    title: 'Получить пользователя по id',
  })
  @Get(UserRoutesEnum.GET_BY_USER_ID)
  get(
    @Query(UserGetQueryParametersEnum.USER_ID, new ParseMongoIdPipe()) userId: Types.ObjectId,
    @Fields({ fieldsEnum: UserFieldsEnum, additionalFieldsEnum: UserAdditionalFieldsEnum, forbiddenFieldsEnum: UserForbiddenFieldsEnum })
    fields?: UserField[]
  ) {
    return this.userService.getById(userId, { fields })
  }

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.USER__UPDATE,
    title: 'Обновить пользователя',
  })
  @Patch(UserRoutesEnum.UPDATE)
  update(@Body() dto: UpdateUserDto) {
    return this.userService.update(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.USER__DELETE,
    title: 'Удалить пользователя',
  })
  @Delete(UserRoutesEnum.DELETE)
  delete(@Query('userId', new ParseMongoIdPipe()) userId: Types.ObjectId) {
    return this.userService.delete(userId)
  }
}
