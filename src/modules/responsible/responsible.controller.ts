import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ResponsibleService } from './responsible.service'
import { CreateResponsibleDto } from './dto/createResponsible.dto'
import { Types } from 'mongoose'
import { UpdateResponsibleDto } from './dto/updateResponsible.dto'
import { LoginResponsibleDto } from './dto/loginResponsible.dto'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { GroupService } from '../group/group.service'
import { GROUP_WITH_ID_NOT_FOUND } from '../group/group.constants'
import { AdminJwtAuthGuard } from '../../global/guards/adminJwtAuth.guard'

@Controller()
export class ResponsibleController {
  constructor(
    private readonly responsibleService: ResponsibleService,
    private readonly groupService: GroupService
  ) {}

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/create')
  async create(@Body() dto: CreateResponsibleDto) {
    let nonexistentGroup: Types.ObjectId | null = null

    for await (const group of dto.groups) {
      const candidate = await this.groupService.getById(group)

      if (!candidate) {
        nonexistentGroup = group
        break
      }
    }

    if (nonexistentGroup) {
      throw new HttpException(GROUP_WITH_ID_NOT_FOUND(nonexistentGroup), HttpStatus.NOT_FOUND)
    }

    return this.responsibleService.create(dto)
  }

  @Get('/by-id')
  async getById(@Query('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.responsibleService.getById(id)
  }

  @Get('/all')
  async getAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('count', ParseIntPipe) count: number,
    @Query('name') name?: string
  ) {
    return {
      responsibles: await this.responsibleService.getAll(page, count, name || ''),
      count: await this.responsibleService.countAll(name || ''),
    }
  }

  @Get('/by-group')
  async getAllByGroup(@Query('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.responsibleService.getAllByGroup(id)
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch('/reset-password/:id')
  async resetPassword(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.responsibleService.resetPassword(id)
  }

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch()
  async update(@Body() dto: UpdateResponsibleDto) {
    return this.responsibleService.update(dto)
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete('/:id')
  async delete(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.responsibleService.delete(id)
  }

  @UsePipes(new ValidationPipe())
  @Post('/login')
  async login(@Body() dto: LoginResponsibleDto) {
    return this.responsibleService.login(dto)
  }
}
