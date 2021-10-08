import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { GroupService } from './group.service'
import { CreateGroupDto } from './dto/createGroup.dto'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'
import { FacultyService } from '../faculty/faculty.service'
import { AdminJwtAuthGuard } from '../../global/guards/adminJwtAuth.guard'
import { ResponsibleService } from '../responsible/responsible.service'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import checkAlternativeQueryParameters, {
  ParameterObjectType,
} from '../../global/utils/alternativeQueryParameters'
import {
  GetGroupsEnum,
  GroupAdditionalFieldsEnum,
  GroupField,
  GroupFieldsEnum,
} from './group.constants'
import { ParseFieldsPipe } from '../../global/pipes/fields.pipe'
import normalizeFields from '../../global/utils/normalizeFields'
import { Functionality } from '../../decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'

@Controller()
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly facultyService: FacultyService,
    private readonly responsibleService: ResponsibleService
  ) {}

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__CREATE,
    title: 'Создать группу',
  })
  @UsePipes(new ValidationPipe())
  @Post('/')
  async create(@Body() dto: CreateGroupDto) {
    await this.facultyService.getById(dto.faculty)

    return this.groupService.create(dto)
  }

  @Get('/')
  async get(
    @Query('groupId', new ParseMongoIdPipe({ required: false })) groupId?: Types.ObjectId,
    @Query('responsibleId', new ParseMongoIdPipe({ required: false }))
    responsibleId?: Types.ObjectId,
    @Query('facultyId', new ParseMongoIdPipe({ required: false })) facultyId?: Types.ObjectId,
    @Query('page', new CustomParseIntPipe({ required: false })) page?: number,
    @Query('count', new CustomParseIntPipe({ required: false })) count?: number,
    @Query('title') title?: string,
    @Query(
      'fields',
      new ParseFieldsPipe({
        fieldsEnum: GroupFieldsEnum,
        additionalFieldsEnum: GroupAdditionalFieldsEnum,
      })
    )
    fields?: GroupField[]
  ) {
    const request = checkAlternativeQueryParameters<GetGroupsEnum>(
      { required: { groupId }, fields, enum: GetGroupsEnum.groupId },
      {
        required: { responsibleId },
        page,
        count,
        title,
        fields,
        enum: GetGroupsEnum.responsibleId,
      },
      { required: { facultyId }, page, count, title, fields, enum: GetGroupsEnum.facultyId },
      { required: { page, count }, title, fields, enum: GetGroupsEnum.all }
    )

    switch (request.enum) {
      case GetGroupsEnum.groupId:
        return this._getByGroupId(request)
      case GetGroupsEnum.responsibleId:
        return this._getByResponsibleId(request)
      case GetGroupsEnum.facultyId:
        return this._getByFacultyId(request)
      case GetGroupsEnum.all:
        return this._getMany(request)
    }
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__GET_BY_GROUP_ID,
    title: 'Запросить одну группу',
  })
  private async _getByGroupId(request: ParameterObjectType<GetGroupsEnum>) {
    return normalizeFields(await this.groupService.getById(request.groupId, request.fields), {
      fields: request.fields,
    })
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__GET_BY_RESPONSIBLE_ID,
    title: 'Запросить по id ответственного',
  })
  private async _getByResponsibleId(request: ParameterObjectType<GetGroupsEnum>) {
    return normalizeFields(
      await this.responsibleService.getAllGroupsByResponsible(
        request.responsibleId,
        request.fields
      ),
      { fields: request.fields }
    )
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__GET_BY_FACULTY_ID,
    title: 'Запросить по id факультета',
  })
  private async _getByFacultyId(request: ParameterObjectType<GetGroupsEnum>) {
    return normalizeFields(
      await this.groupService.getByFacultyId(request.facultyId, request.fields),
      { fields: request.fields }
    )
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__GET_MANY,
    title: 'Запросить множество групп',
  })
  private async _getMany(request: ParameterObjectType<GetGroupsEnum>) {
    return {
      groups: normalizeFields(
        await this.groupService.getAll(request.page, request.count, request.title, request.fields),
        { fields: request.fields }
      ),
      count: await this.groupService.countAll(request.title),
    }
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__UPDATE,
    title: 'Обновить группу',
  })
  @UsePipes(new ValidationPipe())
  @Patch('/')
  async update(@Body() dto: UpdateGroupDto) {
    return this.groupService.update(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__DELETE,
    title: 'Обновить группу',
  })
  @UseGuards(AdminJwtAuthGuard)
  @Delete('/')
  async delete(@Query('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    return this.groupService.delete(id)
  }

  // -----------------
  // updateHandler(
  //   functionality: AvailableFunctionality<GroupUpdateDataForFunctionality>,
  //   body: UpdateGroupDto
  // ) {}
}
