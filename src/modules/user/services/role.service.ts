import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CheckExistenceService } from '../../../global/classes/CheckExistenceService'
import { RoleModel } from '../models/role.model'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ROLE_WITH_ID_NOT_FOUND, ROLE_WITH_LABEL_EXISTS } from '../../../global/constants/errors.constants'
import { CreateRoleDto } from '../dto/role/createRole.dto'
import { roleServiceMethodDefaultOptions } from '../constants/role.constants'
import { mergeOptionsWithDefaultOptions } from '../../../global/utils/serviceMethodOptions'
import { FilterQuery, QueryOptions, Types } from 'mongoose'
import { DocumentType } from '@typegoose/typegoose'
import { UpdateRoleDto } from '../dto/role/updateRole.dto'
import { UserService } from './user.service'

@Injectable()
export class RoleService extends CheckExistenceService<RoleModel> {
  constructor(
    @InjectModel(RoleModel) private readonly roleModel: ModelType<RoleModel>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService
  ) {
    super(roleModel, undefined, arg => ROLE_WITH_ID_NOT_FOUND(arg._id))
  }

  async create(dto: CreateRoleDto, options = roleServiceMethodDefaultOptions.create) {
    options = mergeOptionsWithDefaultOptions(options, roleServiceMethodDefaultOptions.create)
    await this.throwIfExists({ label: dto.label }, { error: ROLE_WITH_LABEL_EXISTS(dto.label) })

    return this.roleModel.create(dto)
  }

  async getById(roleId: Types.ObjectId, queryOptions?: QueryOptions, options = roleServiceMethodDefaultOptions.getById) {
    options = mergeOptionsWithDefaultOptions(options, roleServiceMethodDefaultOptions.getById)
    if (options.checkExistence.role) await this.throwIfNotExists({ _id: roleId })

    return this.roleModel.findById(roleId, queryOptions).exec()
  }

  async getByIds(rolesIds: Types.ObjectId[], queryOptions?: QueryOptions, options = roleServiceMethodDefaultOptions.getByIds) {
    options = mergeOptionsWithDefaultOptions(options, roleServiceMethodDefaultOptions.getByIds)
    if (options.checkExistence.role) await this.throwIfNotExists(rolesIds.map(id => ({ _id: id })))

    return this.roleModel.find({ _id: { $in: rolesIds } }, queryOptions).exec()
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

  async update(dto: UpdateRoleDto, options = roleServiceMethodDefaultOptions.update) {
    options = mergeOptionsWithDefaultOptions(options, roleServiceMethodDefaultOptions.update)
    if (options.checkExistence.role) await this.throwIfNotExists({ _id: dto.id })

    const { id, ...fields } = dto
    return this.roleModel.updateOne({ _id: id }, { $set: fields })
  }

  async deleteById(roleId: Types.ObjectId, options = roleServiceMethodDefaultOptions.deleteById) {
    if (options.checkExistence.role) await this.throwIfNotExists({ _id: roleId })
    await this.userService.clearFrom(roleId, RoleModel)
    return this.roleModel.deleteOne({ _id: roleId })
  }
}
