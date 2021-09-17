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
import checkAlternativeQueryParameters from '../../global/utils/alternativeQueryParameters'
import { ParseFieldsPipe } from '../../global/pipes/fields.pipe'
import {
  GetResponsibleEnum,
  ResponsibleAdditionalFieldsEnum,
  ResponsibleFieldsEnum,
  ResponsibleForbiddenFieldsEnum,
} from './responsible.constants'
import { ResponsibleField } from './responsible.constants'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'

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

  @UsePipes(AdminJwtAuthGuard)
  @Get('/')
  async get(
    @Query('responsibleId', ParseMongoIdPipe) responsibleId?: Types.ObjectId,
    @Query('groupId', ParseMongoIdPipe) groupId?: Types.ObjectId,
    @Query('page', CustomParseIntPipe) page?: number,
    @Query('count', CustomParseIntPipe) count?: number,
    @Query('name') name?: string,
    @Query(
      'fields',
      new ParseFieldsPipe({
        fieldsEnum: ResponsibleFieldsEnum,
        additionalFieldsEnum: ResponsibleAdditionalFieldsEnum,
        forbiddenFieldsEnum: ResponsibleForbiddenFieldsEnum,
      })
    )
    fields?: ResponsibleField[]
  ) {
    const request = checkAlternativeQueryParameters<GetResponsibleEnum>(
      { required: { responsibleId }, fields, enum: GetResponsibleEnum.responsibleId },
      { required: { groupId }, page, count, name, fields, enum: GetResponsibleEnum.groupId },
      { required: { page, count }, name, fields, enum: GetResponsibleEnum.all }
    )

    switch (request.enum) {
      case GetResponsibleEnum.responsibleId:
        return this.responsibleService.getById(request.responsibleId, request.fields)
      case GetResponsibleEnum.groupId:
        return {
          responsibles: await this.responsibleService.getAllByGroup(
            request.groupId,
            request.page,
            request.count,
            request.fields
          ),
          count: await this.responsibleService.countByGroup(request.groupId),
        }
      case GetResponsibleEnum.all:
        return {
          responsibles: await this.responsibleService.getAll(
            request.page,
            request.count,
            request.name,
            request.fields
          ),
          count: await this.responsibleService.countByName(request.name),
        }
    }
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
