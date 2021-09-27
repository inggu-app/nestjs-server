import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
import { GROUP_WITH_ID_NOT_FOUND } from '../../global/constants/errors.constants'
import normalizeFields from '../../global/utils/normalizeFields'

@Controller()
export class ResponsibleController {
  constructor(
    private readonly responsibleService: ResponsibleService,
    private readonly groupService: GroupService
  ) {}

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/')
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
    @Query('responsibleId', new ParseMongoIdPipe({ required: false }))
    responsibleId?: Types.ObjectId,
    @Query('groupId', new ParseMongoIdPipe({ required: false })) groupId?: Types.ObjectId,
    @Query('page', new CustomParseIntPipe({ required: false })) page?: number,
    @Query('count', new CustomParseIntPipe({ required: false })) count?: number,
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
        return normalizeFields(
          await this.responsibleService.getById(request.responsibleId, request.fields),
          { fields: request.fields, forbiddenFields: ResponsibleForbiddenFieldsEnum }
        )
      case GetResponsibleEnum.groupId:
        return {
          responsibles: await normalizeFields(
            await this.responsibleService.getAllByGroup(
              request.groupId,
              request.page,
              request.count,
              request.fields
            ),
            { fields: request.fields, forbiddenFields: ResponsibleForbiddenFieldsEnum }
          ),
          count: await this.responsibleService.countByGroup(request.groupId),
        }
      case GetResponsibleEnum.all:
        return {
          responsibles: await normalizeFields(
            await this.responsibleService.getAll(
              request.page,
              request.count,
              request.name,
              request.fields
            ),
            { fields: request.fields, forbiddenFields: ResponsibleForbiddenFieldsEnum }
          ),
          count: await this.responsibleService.countByName(request.name),
        }
    }
  }

  @UseGuards(AdminJwtAuthGuard)
  @Patch('/reset-password')
  async resetPassword(@Query('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    return this.responsibleService.resetPassword(id)
  }

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch('/')
  async update(@Body() dto: UpdateResponsibleDto) {
    return this.responsibleService.update(dto)
  }

  @UseGuards(AdminJwtAuthGuard)
  @Delete('/')
  async delete(@Query('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    return this.responsibleService.delete(id)
  }

  @UsePipes(new ValidationPipe())
  @Post('/login')
  async login(@Body() dto: LoginResponsibleDto) {
    return this.responsibleService.login(dto)
  }
}
