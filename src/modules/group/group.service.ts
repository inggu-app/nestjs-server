import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GroupModel } from './group.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateGroupDto } from './dto/create-group.dto'
import { Types } from 'mongoose'
import { GROUP_EXISTS, GROUP_NOT_FOUND, GROUP_WITH_ID_NOT_FOUND } from './group.constants'
import { ResponsibleService } from '../responsible/responsible.service'

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(GroupModel) private readonly groupModel: ModelType<GroupModel>,
    @Inject(forwardRef(() => ResponsibleService))
    private readonly responsibleService: ResponsibleService
  ) {}

  async create(dto: CreateGroupDto) {
    const candidate = await this.groupModel.findOne({ title: dto.title })

    if (candidate) {
      throw new HttpException(GROUP_EXISTS, HttpStatus.BAD_REQUEST)
    }
    return this.groupModel.create(dto)
  }

  async getById(groupId: Types.ObjectId) {
    const candidate = await this.groupModel.findOne({ _id: groupId })

    if (!candidate) {
      throw new HttpException(GROUP_WITH_ID_NOT_FOUND(groupId), HttpStatus.NOT_FOUND)
    }

    return candidate
  }

  getAll() {
    return this.groupModel.find()
  }

  getByFacultyIdForDropdown(facultyId: Types.ObjectId) {
    return this.groupModel.find({ faculty: facultyId }, { title: 1 })
  }

  async delete(groupId: Types.ObjectId) {
    const candidate = await this.groupModel.deleteOne({ _id: groupId })

    await this.responsibleService.deleteGroupsFromAllResponsibles([groupId])

    if (!candidate.deletedCount) {
      throw new HttpException(GROUP_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
  }

  async deleteAllByFacultyId(facultyId: Types.ObjectId) {
    const groups = await this.groupModel.find({ faculty: facultyId })
    const groupsIds: Types.ObjectId[] = groups.map(group => group.id)

    await this.responsibleService.deleteGroupsFromAllResponsibles(groupsIds)
    return this.groupModel.deleteMany({ faculty: facultyId })
  }

  updateLastScheduleUpdate(group: Types.ObjectId, date: Date) {
    return this.groupModel.findByIdAndUpdate(group, { $set: { lastScheduleUpdate: date } })
  }
}
