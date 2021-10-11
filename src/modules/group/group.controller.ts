import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { GroupService } from './group.service'
import { CreateGroupDto } from './dto/createGroup.dto'
import { Types } from 'mongoose'
import { FacultyService } from '../faculty/faculty.service'
import { ResponsibleService } from '../responsible/responsible.service'
import { UpdateGroupDto } from './dto/updateGroup.dto'
import { CustomParseIntPipe } from '../../global/pipes/int.pipe'
import { GroupAdditionalFieldsEnum, GroupField, GroupFieldsEnum, GroupGetQueryParametersEnum, GroupRoutesEnum } from './group.constants'
import normalizeFields from '../../global/utils/normalizeFields'
import { Functionality } from '../../global/decorators/Functionality.decorator'
import { FunctionalityCodesEnum } from '../../global/enums/functionalities.enum'
import { Fields } from '../../global/decorators/Fields.decorator'
import { MongoId } from '../../global/decorators/MongoId.decorator'

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
    title: 'Создать группу',
  })
  @Post(GroupRoutesEnum.CREATE)
  async create(@Body() dto: CreateGroupDto) {
    await this.facultyService.getById(dto.faculty)

    return this.groupService.create(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__GET_BY_GROUP_ID,
    title: 'Запросить одну группу',
  })
  @Get(GroupRoutesEnum.GET_BY_GROUP_ID)
  private async getByGroupId(
    @MongoId(GroupGetQueryParametersEnum.GROUP_ID) groupId: Types.ObjectId,
    @Fields({ fieldsEnum: GroupFieldsEnum, additionalFieldsEnum: GroupAdditionalFieldsEnum }) fields?: GroupField[]
  ) {
    return normalizeFields(await this.groupService.getById(groupId, fields), { fields })
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__GET_BY_USER_ID,
    title: 'Запросить по id ответственного',
  })
  @Get(GroupRoutesEnum.GET_BY_USER_ID)
  private async getByUserId(
    @MongoId(GroupGetQueryParametersEnum.USER_ID) userId: Types.ObjectId,
    @Fields({ fieldsEnum: GroupFieldsEnum, additionalFieldsEnum: GroupAdditionalFieldsEnum }) fields?: GroupField[]
  ) {
    return normalizeFields(await this.responsibleService.getAllGroupsByResponsible(userId, fields), { fields })
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__GET_BY_FACULTY_ID,
    title: 'Запросить по id факультета',
  })
  @Get(GroupRoutesEnum.GET_BY_FACULTY_ID)
  private async getByFacultyId(
    @MongoId(GroupGetQueryParametersEnum.FACULTY_ID) facultyId: Types.ObjectId,
    @Fields({ fieldsEnum: GroupFieldsEnum, additionalFieldsEnum: GroupAdditionalFieldsEnum }) fields?: GroupField[]
  ) {
    return normalizeFields(await this.groupService.getByFacultyId(facultyId, fields), { fields })
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__GET_MANY,
    title: 'Запросить множество групп',
  })
  @Get(GroupRoutesEnum.GET_MANY)
  private async getMany(
    @Query(GroupGetQueryParametersEnum.PAGE, new CustomParseIntPipe()) page: number,
    @Query(GroupGetQueryParametersEnum.COUNT, new CustomParseIntPipe()) count: number,
    @Query(GroupGetQueryParametersEnum.TITLE) title?: string,
    @Fields({ fieldsEnum: GroupFieldsEnum, additionalFieldsEnum: GroupAdditionalFieldsEnum }) fields?: GroupField[]
  ) {
    return {
      groups: normalizeFields(await this.groupService.getAll(page, count, title, fields), { fields }),
      count: await this.groupService.countAll(title),
    }
  }

  @UsePipes(new ValidationPipe())
  @Functionality({
    code: FunctionalityCodesEnum.GROUP__UPDATE,
    title: 'Обновить группу',
  })
  @Patch(GroupRoutesEnum.UPDATE)
  async update(@Body() dto: UpdateGroupDto) {
    return this.groupService.update(dto)
  }

  @Functionality({
    code: FunctionalityCodesEnum.GROUP__DELETE,
    title: 'Удалить группу',
  })
  @Delete(GroupRoutesEnum.DELETE)
  delete(@MongoId('groupId') groupId: Types.ObjectId) {
    return this.groupService.delete(groupId)
  }
}
