import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { RoleModel } from './role.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ModelBase, ObjectByInterface } from '../../global/types'
import { Error, Types } from 'mongoose'
import { ROLE_WITH_ID_NOT_FOUND, ROLE_WITH_TITLE_EXISTS } from '../../global/constants/errors.constants'
import { RoleField, RoleFieldsEnum } from './role.constants'
import { CreateRoleDto } from './dto/createRole.dto'
import { UpdateRoleDto } from './dto/updateRole.dto'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'

@Injectable()
export class RoleService {
  constructor(@InjectModel(RoleModel) private readonly roleModel: ModelType<RoleModel>) {}

  async create(dto: CreateRoleDto) {
    await this.checkExists({ title: dto.title }, new BadRequestException(ROLE_WITH_TITLE_EXISTS(dto.title)), false)
    await this.roleModel.create(dto)

    return
  }

  async getById(id: Types.ObjectId, fields?: RoleField[]) {
    await this.checkExists({ _id: id })
    return this.roleModel.findById({ _id: id }, fieldsArrayToProjection(fields))
  }

  async getByTitle(title: string, fields?: RoleField[]) {
    await this.checkExists({ title })
    return this.roleModel.findOne({ title }, fieldsArrayToProjection(fields))
  }

  async getMany(fields?: RoleField[]) {
    return this.roleModel.find({}, fieldsArrayToProjection(fields))
  }

  async update(dto: UpdateRoleDto) {
    await this.checkExists({ _id: dto.id })
    await this.roleModel.updateOne({ _id: dto.id }, { $set: dto })
  }

  async deleteById(id: Types.ObjectId) {
    await this.checkExists({ _id: id })
    await this.roleModel.deleteOne({ _id: id })
    return
  }

  async deleteByTitle(title: string) {
    await this.checkExists({ title })
    await this.roleModel.deleteOne({ title })
    return
  }

  async checkExists(
    filter: ObjectByInterface<typeof RoleFieldsEnum, ModelBase> | ObjectByInterface<typeof RoleFieldsEnum, ModelBase>[],
    error: ((filter: ObjectByInterface<typeof RoleFieldsEnum, ModelBase>) => Error) | Error = f =>
      new NotFoundException(ROLE_WITH_ID_NOT_FOUND(f._id)),
    checkExisting = true
  ) {
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.roleModel.exists(f)

        if (!candidate && checkExisting) {
          if (error instanceof Error) throw Error
          throw error(f)
        } else if (candidate && !checkExisting) {
          if (error instanceof Error) throw Error
          throw error(f)
        }
      }
    } else {
      const candidate = await this.roleModel.exists(filter)
      if (!candidate && checkExisting) {
        if (error instanceof Error) throw error
        throw error(filter)
      } else if (candidate && !checkExisting) {
        if (error instanceof Error) throw error
        throw error(filter)
      }
    }

    return true
  }
}
