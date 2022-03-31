import { Injectable } from '@nestjs/common'
import { CheckExistenceService } from '../../../global/classes/CheckExistenceService'
import { RoleModel } from '../models/role.model'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ROLE_WITH_ID_NOT_FOUND, ROLE_WITH_LABEL_EXISTS } from '../../../global/constants/errors.constants'
import { CreateRoleDto } from '../dto/role/createRole.dto'
import { roleServiceMethodDefaultOptions } from '../constants/role.constants'
import { mergeOptionsWithDefaultOptions } from '../../../global/utils/serviceMethodOptions'
import { FilterQuery, QueryOptions } from 'mongoose'
import { DocumentType } from '@typegoose/typegoose'

@Injectable()
export class RoleService extends CheckExistenceService<RoleModel> {
  constructor(@InjectModel(RoleModel) private readonly roleModel: ModelType<RoleModel>) {
    super(roleModel, undefined, arg => ROLE_WITH_ID_NOT_FOUND(arg._id))
  }

  async create(dto: CreateRoleDto, options = roleServiceMethodDefaultOptions.create) {
    options = mergeOptionsWithDefaultOptions(options, roleServiceMethodDefaultOptions.create)
    await this.throwIfExists({ label: dto.label }, { error: ROLE_WITH_LABEL_EXISTS(dto.label) })

    return this.roleModel.create(dto)
  }

  async getMany(
    page: number,
    count: number,
    label?: string,
    queryOptions?: QueryOptions,
    options = roleServiceMethodDefaultOptions.getMany
  ) {
    const filter: FilterQuery<DocumentType<RoleModel>> = {}
    if (label) filter.label = { $regex: label, $options: 'i' }

    return this.roleModel
      .find(filter, undefined, queryOptions)
      .skip((page - 1) * count)
      .limit(count)
      .exec()
  }

  async countMany(label?: string, options = roleServiceMethodDefaultOptions.countMany) {
    const filter: FilterQuery<DocumentType<RoleModel>> = {}
    if (label) filter.label = { $regex: label, $options: 'i' }

    return this.roleModel.countDocuments(filter).exec()
  }
}