import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GroupModel } from './group.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateGroupDto } from './dto/create-group.dto'
import { Types } from 'mongoose'
import { GROUP_EXISTS } from './group.constants'

@Injectable()
export class GroupService {
  constructor(@InjectModel(GroupModel) private readonly reviewModel: ModelType<GroupModel>) {}

  async create(dto: CreateGroupDto) {
    const candidate = await this.reviewModel.findOne({ title: dto.title })

    if (candidate) {
      throw new HttpException(GROUP_EXISTS, HttpStatus.BAD_REQUEST)
    }
    return this.reviewModel.create(dto)
  }

  getByFacultyIdForDropdown(facultyId: Types.ObjectId) {
    return this.reviewModel.find({ faculty: facultyId }, { title: 1 })
  }
}
