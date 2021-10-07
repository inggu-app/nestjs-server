import { Body, Controller, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/createUser.dto'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { UpdateUserDto } from './dto/updateUser.dto'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post('/')
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto)
  }

  @Get()
  get(@Query('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    return this.userService.getById(id)
  }

  @UsePipes(new ValidationPipe())
  @Patch()
  update(@Body() dto: UpdateUserDto) {
    return this.userService.update(dto)
  }
}
