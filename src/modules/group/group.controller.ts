import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UsePipes, ValidationPipe } from '@nestjs/common'
import { GroupService } from './group.service'
import { CreateGroupDto } from './dto/createGroup.dto'
import { Types } from 'mongoose'
import { FacultyService } from '../faculty/faculty.service'
import { ResponsibleService } from '../responsible/responsible.service'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import {
  defaultGroupCreateData,
  defaultGroupDeleteData,
  defaultGroupGetByFacultyIdData,
  defaultGroupGetByGroupIdData,
  defaultGroupGetByGroupIdsData,
  defaultGroupGetByUserIdData,
  defaultGroupGetManyData,
  defaultGroupUpdateData,
  GroupAdditionalFieldsEnum,
  GroupField,
  GroupFieldsEnum,
  GroupGetByFacultyIdDataForFunctionality,
  GroupGetQueryParametersEnum,
  GroupRoutesEnum,
} from './group.constants'
import normalizeFields from '../../global/utils/normalizeFields'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { Fields } from '../../global/decorators/Fields.decorator'
import { MongoId } from '../../global/decorators/MongoId.decorator'
import { CustomRequest } from '../../global/guards/baseJwtAuth.guard'

@Controller()
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly facultyService: FacultyService,
    private readonly responsibleService: ResponsibleService
  ) {}

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.GROUP__CREATE,
    default: defaultGroupCreateData,
    title: 'Создать группу',
  })
  @Post(GroupRoutesEnum.CREATE)
  async create(@Body() dto: CreateGroupDto) {
    await this.facultyService.getById(dto.faculty)

    return this.groupService.create(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__GET_BY_GROUP_ID,
    default: defaultGroupGetByGroupIdData,
    title: 'Запросить одну группу по id',
  })
  @Get(GroupRoutesEnum.GET_BY_GROUP_ID)
  async getByGroupId(@MongoId(GroupGetQueryParametersEnum.GROUP_ID) groupId: Types.ObjectId, @GetGroupFields() fields?: GroupField[]) {
    return normalizeFields(await this.groupService.getById(groupId, { fields }), { fields })
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__GET_BY_GROUP_IDS,
    default: defaultGroupGetByGroupIdsData,
    title: 'Запросить список групп по списку id',
  })
  @Get(GroupRoutesEnum.GET_BY_GROUP_IDS)
  async getByGroupIds(
    @MongoId(GroupGetQueryParametersEnum.GROUP_IDS, { multiple: true }) groupIds: Types.ObjectId[],
    @GetGroupFields() fields?: GroupField[]
  ) {
    return normalizeFields(await this.groupService.getByGroupIds(groupIds, { fields }), { fields })
  }
  @Functionality({
    code: FunctionalityCodesEnum.GROUP__GET_BY_USER_ID,
    default: defaultGroupGetByUserIdData,
    title: 'Запросить по id ответственного',
  })
  @Get(GroupRoutesEnum.GET_BY_USER_ID)
  private async getByUserId(@MongoId(GroupGetQueryParametersEnum.USER_ID) userId: Types.ObjectId, @GetGroupFields() fields?: GroupField[]) {
    return normalizeFields(await this.responsibleService.getAllGroupsByResponsible(userId, fields), { fields })
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__GET_BY_FACULTY_ID,
    default: defaultGroupGetByFacultyIdData,
    title: 'Запросить по id факультета',
  })
  @Get(GroupRoutesEnum.GET_BY_FACULTY_ID)
  private async getByFacultyId(
    @MongoId(GroupGetQueryParametersEnum.FACULTY_ID) facultyId: Types.ObjectId,
    @Req() { functionality }: CustomRequest<any, GroupGetByFacultyIdDataForFunctionality>,
    @GetGroupFields() fields?: GroupField[]
  ) {
    return normalizeFields(await this.groupService.getByFacultyId(facultyId, { fields, functionality }), { fields })
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__GET_MANY,
    default: defaultGroupGetManyData,
    title: 'Запросить множество групп',
  })
  @Get(GroupRoutesEnum.GET_MANY)
  private async getMany(
    @Query(GroupGetQueryParametersEnum.PAGE, new CustomParseIntPipe()) page: number,
    @Query(GroupGetQueryParametersEnum.COUNT, new CustomParseIntPipe()) count: number,
    @Query(GroupGetQueryParametersEnum.TITLE) title?: string,
    @GetGroupFields() fields?: GroupField[]
  ) {
    return {
      groups: normalizeFields(await this.groupService.getAll(page, count, title, { fields }), { fields }),
      count: await this.groupService.countAll(title),
    }
  }

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.GROUP__UPDATE,
    default: defaultGroupUpdateData,
    title: 'Обновить группу',
  })
  @Patch(GroupRoutesEnum.UPDATE)
  async update(@Body() dto: UpdateGroupDto) {
    return this.groupService.update(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__DELETE,
    default: defaultGroupDeleteData,
    title: 'Удалить группу',
  })
  @Delete(GroupRoutesEnum.DELETE)
  delete(@MongoId('groupId') groupId: Types.ObjectId) {
    return this.groupService.delete(groupId)
  }
}

function GetGroupFields() {
  return Fields({ fieldsEnum: GroupFieldsEnum, additionalFieldsEnum: GroupAdditionalFieldsEnum })
}
