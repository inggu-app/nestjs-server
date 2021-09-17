import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { OwnerJwtAuthGuard } from '../../global/guards/ownerJwtAuth.guard'
import { AdminService } from './admin.service'
import { CreateAdminDto } from './dto/createAdmin.dto'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { UpdateAdminDto } from './dto/updateAdmin.dto'
import { LoginAdminDto } from './dto/loginAdmin.dto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import { ParseFieldsPipe } from '../../global/pipes/fields.pipe'
import { AdminField, AdminFieldsEnum, GetAdminsEnum } from './admin.constants'
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(OwnerJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/')
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto)
  }

  @UseGuards(OwnerJwtAuthGuard)
  @Get('/')
  get(
    @Query('adminId', ParseMongoIdPipe) adminId?: Types.ObjectId,
    @Query('page', CustomParseIntPipe) page?: number,
    @Query('count', CustomParseIntPipe) count?: number,
    @Query('name') name?: number,
    @Query('fields', new ParseFieldsPipe(AdminFieldsEnum)) fields?: AdminField[]
  ) {
    const request = checkAlternativeQueryParameters<GetAdminsEnum>(
      { required: { adminId }, fields, enum: GetAdminsEnum.adminId },
      { required: { page, count }, name, fields, enum: GetAdminsEnum.all }
    )

    switch (request.enum) {
      case GetAdminsEnum.adminId:
        return this.adminService.getById(request.adminId)
      case GetAdminsEnum.all:
        return this.adminService.getAll(request.page, request.count, request.name, request.fields)
    }
  }

  @UseGuards(OwnerJwtAuthGuard)
  @Patch('/reset-password/:id')
  resetPassword(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.adminService.resetPassword(id)
  }

  @UseGuards(OwnerJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch('/')
  update(@Body() dto: UpdateAdminDto) {
    return this.adminService.update(dto)
  }

  @UseGuards(OwnerJwtAuthGuard)
  @Delete('/:id')
  delete(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.adminService.delete(id)
  }

  @UsePipes(new ValidationPipe())
  @Post('/login')
  login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto)
  }
}
