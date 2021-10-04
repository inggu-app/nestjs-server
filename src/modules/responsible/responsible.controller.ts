import {
  Body,
  Controller,
  Delete,
  Get,
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
  ResponsibleField,
  ResponsibleFieldsEnum,
  ResponsibleForbiddenFieldsEnum,
} from './responsible.constants'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import normalizeFields from '../../global/utils/normalizeFields'
import { FacultyService } from '../faculty/faculty.service'
import { GROUP_WITH_ID_NOT_FOUND } from '../../global/constants/errors.constants'

@Controller()
export class ResponsibleController {
  constructor(
    private readonly responsibleService: ResponsibleService,
    private readonly facultyService: FacultyService,
    private readonly groupService: GroupService
  ) {}

  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('/')
  async create(@Body() dto: CreateResponsibleDto) {
    await this.groupService.checkExists(
      [...dto.groups, ...dto.forbiddenGroups].map(g => ({ _id: g })),
      { message: GROUP_WITH_ID_NOT_FOUND, type: HttpStatus.NOT_FOUND, key: '_id' }
    )
    await this.facultyService.checkExists(dto.faculties)

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
          responsibles: normalizeFields(
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
          responsibles: normalizeFields(
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
    await this.groupService.checkExists(
      [...dto.groups, ...dto.forbiddenGroups].map(g => ({ _id: g })),
      { message: GROUP_WITH_ID_NOT_FOUND, type: HttpStatus.NOT_FOUND, key: '_id' }
    )
    await this.facultyService.checkExists(dto.faculties)

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
