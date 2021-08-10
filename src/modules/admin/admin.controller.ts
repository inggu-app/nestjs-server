import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(OwnerJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto)
  }

  @UseGuards(OwnerJwtAuthGuard)
  @Get('/:id')
  get(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.adminService.getById(id)
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
}
