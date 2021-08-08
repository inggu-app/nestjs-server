import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
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

@Controller()
export class ResponsibleController {
  constructor(
    private readonly responsibleService: ResponsibleService,
    private readonly groupService: GroupService
  ) {}

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

  @Get('/:id')
  async getById(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.responsibleService.getById(id)
  }

  @Patch('/reset-password/:id')
  async resetPassword(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.responsibleService.resetPassword(id)
  }

  @UsePipes(new ValidationPipe())
  @Patch()
  async update(@Body() dto: UpdateResponsibleDto) {
    return this.responsibleService.update(dto)
  }

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
