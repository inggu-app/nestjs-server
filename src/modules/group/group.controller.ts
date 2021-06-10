import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { GroupService } from './group.service'
import { CreateGroupDto } from './dto/create-group.dto'
import { ParseMongoIdPipe } from '../../global/pipes/mongoId.pipe'
import { Types } from 'mongoose'

@Controller()
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UsePipes(new ValidationPipe())
  @Post('/create')
  create(@Body() dto: CreateGroupDto) {
    return this.groupService.create(dto)
  }

  @Get('get/:facultyId/dropdown')
  getFacultyGroupsForDropdown(@Param('facultyId', ParseMongoIdPipe) facultyId: Types.ObjectId) {
    return this.groupService.getByFacultyIdForDropdown(facultyId)
  }

  @Delete('/delete/:groupId')
  delete(@Param('groupId', ParseMongoIdPipe) groupId: Types.ObjectId) {
    return this.groupService.delete(groupId)
  }
}
