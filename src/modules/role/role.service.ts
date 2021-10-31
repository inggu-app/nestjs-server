import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { RoleModel } from './role.model'
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types'
import { ModelBase, MongoIdString, ObjectByInterface, ServiceGetOptions } from '../../global/types'
import { Error, FilterQuery, Types } from 'mongoose'
import {
  FUNCTIONALITY_EXTRA_FIELDS,
  FUNCTIONALITY_INCORRECT_FIELD_TYPE,
  FUNCTIONALITY_INCORRECT_FIELD_VALUE,
  FUNCTIONALITY_MISSING_FIELDS,
  ROLE_INCORRECT_FIELD_MODEL,
  ROLE_INCORRECT_FIELD_TYPE,
  ROLE_WITH_ID_NOT_FOUND,
  ROLE_WITH_TITLE_EXISTS,
} from '../../global/constants/errors.constants'
import { RoleField, RoleFieldsEnum, RoleGetManyDataForFunctionality } from './role.constants'
import { CreateRoleDto } from './dto/createRole.dto'
import { UpdateRoleDto } from './dto/updateRole.dto'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { stringToObjectId } from '../../global/utils/stringToObjectId'
import { ViewService } from '../view/view.service'
import { FunctionalityService } from '../functionality/functionality.service'
import { FunctionalityAvailableTypeEnum } from '../../global/enums/FunctionalityAvailableType.enum'
import { objectKeys } from '../../global/utils/objectKeys'
import { isEnum } from 'class-validator'
import { TypesEnum } from '../../global/enums/types.enum'
import { difference } from 'underscore'
import { checkTypes } from '../../global/utils/checkTypes'
import { DbModelsEnum } from '../../global/enums/dbModelsEnum'
import { getModelWithString } from '@typegoose/typegoose'

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleModel) private readonly roleModel: ModelType<RoleModel>,
    private readonly viewService: ViewService,
    private readonly functionalityService: FunctionalityService
  ) {}

  async create(dto: CreateRoleDto) {
    await this.checkExists(
      { title: dto.title, code: dto.code },
      { error: new BadRequestException(ROLE_WITH_TITLE_EXISTS(dto.title)), checkExisting: false }
    )
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
    return this.roleModel
      .findOne(
        { title },
        Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields,
        options?.queryOptions
      )
      .exec()
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
    await this.checkExists({ _id: dto.id })

    if (dto.views) {
      for await (const viewId of dto.views) await this.viewService.checkExists({ _id: viewId })
    }
    if (dto.available) {
      for (const f of dto.available) {
        this.functionalityService.checkExists({ code: f.code })
        const functionality = this.functionalityService.getByCode(f.code)
        const extraFields = difference(objectKeys(f.data), objectKeys(functionality.default))
        if (extraFields.length) throw new BadRequestException(FUNCTIONALITY_EXTRA_FIELDS(f.code, extraFields))
        const missingFields = difference(objectKeys(functionality.default), objectKeys(f.data))
        if (missingFields.length) throw new BadRequestException(FUNCTIONALITY_MISSING_FIELDS(f.code, missingFields))
        for (const field of objectKeys(f.data)) {
          if (
            functionality.default[field].type === FunctionalityAvailableTypeEnum.ALL ||
            functionality.default[field].type === FunctionalityAvailableTypeEnum.CUSTOM
          ) {
            if (f.data[field] !== FunctionalityAvailableTypeEnum.ALL && f.data[field] !== FunctionalityAvailableTypeEnum.CUSTOM)
              throw new BadRequestException(FUNCTIONALITY_INCORRECT_FIELD_TYPE(field))
          } else {
            if (!checkTypes(f.data[field], functionality.default[field].type as TypesEnum)) {
              throw new BadRequestException(FUNCTIONALITY_INCORRECT_FIELD_TYPE(field))
            }
            if (functionality.default[field].model) {
              const model = getModelWithString(functionality.default[field].model as string)
              if (functionality.default[field].type === TypesEnum.MONGO_ID) {
                if (!(await model?.exists({ _id: f.data[field] }))) {
                  throw new BadRequestException(
                    FUNCTIONALITY_INCORRECT_FIELD_VALUE(functionality.default[field].model as string, f.data[field])
                  )
                }
              } else if (functionality.default[field].type === TypesEnum.MONGO_ID_ARRAY) {
                const ids = f.data[field] as Array<any>
                for (const id of ids) {
                  if (!(await model?.exists({ _id: id }))) {
                    throw new BadRequestException(FUNCTIONALITY_INCORRECT_FIELD_VALUE(functionality.default[field].model as string, id))
                  }
                }
              }
            }
          }
        }
      }
    }

    if (dto.roleFields)
      for (const field of objectKeys(dto.roleFields)) {
        if (!isEnum(dto.roleFields[field].type, TypesEnum)) throw new BadRequestException(ROLE_INCORRECT_FIELD_TYPE(field))
        if (
          [TypesEnum.MONGO_ID, TypesEnum.MONGO_ID_ARRAY].includes(dto.roleFields[field].type) &&
          !isEnum(dto.roleFields[field].model, DbModelsEnum)
        )
          throw new BadRequestException(ROLE_INCORRECT_FIELD_MODEL(field))
        if (![TypesEnum.MONGO_ID, TypesEnum.MONGO_ID_ARRAY].includes(dto.roleFields[field].type) && dto.roleFields[field].model !== null)
          throw new BadRequestException(ROLE_INCORRECT_FIELD_MODEL(field))
      }

    const set: any = { ...dto }
    if (dto.available) {
      set.available = dto.available?.map(funct => ({
        ...funct,
        data: objectKeys(funct.data).map(key => ({
          key,
          value: funct.data[key],
        })),
      }))
    }
    await this.roleModel.updateOne(
      { _id: dto.id },
      {
        $set: set,
      }
    )
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
    options?: { error?: ((filter: ObjectByInterface<typeof RoleFieldsEnum, ModelBase>) => Error) | Error; checkExisting?: boolean }
  ) {
    options = {
      error: f => new NotFoundException(ROLE_WITH_ID_NOT_FOUND(f._id)),
      checkExisting: true,
      ...options,
    }
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.roleModel.exists(f)

        if (!candidate && options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        } else if (candidate && !options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        }
      }
    } else {
      const candidate = await this.roleModel.exists(filter)
      if (!candidate && options.checkExisting) {
        if (typeof options.error === 'function') throw options.error(filter)
        throw options.error
      } else if (candidate && !options.checkExisting) {
        if (typeof options.error === 'function') throw options.error(filter)
        throw options.error
      }
    }

    return true
  }
}
