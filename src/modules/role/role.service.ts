import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { RoleModel } from './role.model'
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types'
import { ModelBase, MongoIdString, ObjectByInterface, ServiceGetOptions } from '../../global/types'
import { Error, FilterQuery, Types } from 'mongoose'
import { ROLE_WITH_ID_NOT_FOUND, ROLE_WITH_TITLE_EXISTS } from '../../global/constants/errors.constants'
import { RoleField, RoleFieldsEnum, RoleGetManyDataForFunctionality } from './role.constants'
import { CreateRoleDto } from './dto/createRole.dto'
import { UpdateRoleDto } from './dto/updateRole.dto'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { stringToObjectId } from '../../global/utils/stringToObjectId'
import { ViewService } from '../view/view.service'
import { FunctionalityService } from '../functionality/functionality.service'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleModel) private readonly roleModel: ModelType<RoleModel>,
    private readonly viewService: ViewService,
    private readonly functionalityService: FunctionalityService
  ) {}

  async create(dto: CreateRoleDto) {
    await this.checkExists({ title: dto.title }, new BadRequestException(ROLE_WITH_TITLE_EXISTS(dto.title)), false)
    await this.roleModel.create(dto)

    return
  }

  async getById(id: Types.ObjectId | MongoIdString, options?: ServiceGetOptions<RoleField>) {
    id = stringToObjectId(id)
    await this.checkExists({ _id: id })
    return this.roleModel.findById(
      { _id: id },
      Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields,
      options?.queryOptions
    ) as unknown as DocumentType<RoleModel>
  }

  async getByTitle(title: string, options?: ServiceGetOptions<RoleField>) {
    await this.checkExists({ title })
    return this.roleModel.findOne(
      { title },
      Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields,
      options?.queryOptions
    )
  }

  async getMany(options?: ServiceGetOptions<RoleField, RoleGetManyDataForFunctionality>) {
    const filter: FilterQuery<DocumentType<RoleModel>> = {}
    if (options?.functionality) {
      filter._id = { $nin: options.functionality.data.forbiddenRoles }
      if (options.functionality.data.availableRolesType === FunctionalityAvailableTypeEnum.CUSTOM) {
        filter._id = { $in: options.functionality.data.availableRoles, $nin: options.functionality.data.forbiddenRoles }
      }
    }

    return this.roleModel.find(
      filter,
      Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields,
      options?.queryOptions
    )
  }

  async update(dto: UpdateRoleDto) {
    await this.checkExists({ code: dto.code })

    if (dto.views) {
      for await (const viewId of dto.views) await this.viewService.checkExists({ _id: viewId })
    }
    if (dto.available) {
      for (const functionalityCode of dto.available) this.functionalityService.checkExists({ code: functionalityCode })
    }

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
          if (typeof error === 'function') throw error(f)
          throw error
        } else if (candidate && !checkExisting) {
          if (typeof error === 'function') throw error(f)
          throw error
        }
      }
    } else {
      const candidate = await this.roleModel.exists(filter)
      if (!candidate && checkExisting) {
        if (typeof error === 'function') throw error(filter)
        throw error
      } else if (candidate && !checkExisting) {
        if (typeof error === 'function') throw error(filter)
        throw error
      }
    }

    return true
  }
}
