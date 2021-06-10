import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GroupModel } from './group.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateGroupDto } from './dto/create-group.dto'
import { Types } from 'mongoose'
import { GROUP_EXISTS, GROUP_NOT_FOUND } from './group.constants'

@Injectable()
export class GroupService {
  constructor(@InjectModel(GroupModel) private readonly groupModel: ModelType<GroupModel>) {}

  async create(dto: CreateGroupDto) {
    const candidate = await this.groupModel.findOne({ title: dto.title })

    if (candidate) {
      throw new HttpException(GROUP_EXISTS, HttpStatus.BAD_REQUEST)
    }
    return this.groupModel.create(dto)
  }

  getByFacultyIdForDropdown(facultyId: Types.ObjectId) {
    return this.groupModel.find({ faculty: facultyId }, { title: 1 })
  }

  async delete(groupId: Types.ObjectId) {
    const candidate = await this.groupModel.deleteOne({ _id: groupId })

    if (!candidate.deletedCount) {
      throw new HttpException(GROUP_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
  }

  async deleteAllByFacultyId(facultyId: Types.ObjectId) {
    return this.groupModel.deleteMany({ faculty: facultyId })
  }
}
