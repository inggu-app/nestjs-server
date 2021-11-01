import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ViewModel } from './view.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateViewDto } from './dto/createView.dto'
import { Error, Types } from 'mongoose'
import { ModelBase, MongoIdString, ObjectByInterface, ServiceGetOptions } from '../../global/types'
import { ViewField, ViewFieldsEnum } from './view.constants'
import { stringToObjectId } from '../../global/utils/stringToObjectId'
import {
  INTERFACE_WITH_CODE_NOT_FOUND,
  VIEW_WITH_CODE_EXISTS,
  VIEW_WITH_CODE_NOT_FOUND,
  VIEW_WITH_ID_NOT_FOUND,
} from '../../global/constants/errors.constants'
import fieldsArrayToProjection from '../../global/utils/fieldsArrayToProjection'
import { DocumentType } from '@typegoose/typegoose'
import { UpdateViewDto } from './dto/updateView.dto'
import { UserService } from '../user/user.service'
import { RoleModel } from '../role/role.model'
import { InterfaceModel } from '../interface/interface.model'
import { InterfaceService } from '../interface/interface.service'
import { RoleService } from '../role/role.service'

@Injectable()
export class ViewService {
  constructor(
    @InjectModel(ViewModel) private readonly viewModel: ModelType<ViewModel>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    @Inject(forwardRef(() => RoleService)) private readonly roleService: RoleService,
    private readonly interfaceService: InterfaceService
  ) {}

  async create(dto: CreateViewDto) {
    await this.checkExists({ code: dto.code }, { error: new BadRequestException(VIEW_WITH_CODE_EXISTS(dto.code)), checkExisting: false })
    const intrfc = await this.interfaceService.getByCode(dto.interface)
    await this.viewModel.create({ ...dto, interface: intrfc.id })
    return
  }

  async getById(id: Types.ObjectId | MongoIdString, options?: ServiceGetOptions<ViewField>) {
    id = stringToObjectId(id)
    await this.checkExists({ _id: id })

    return this.viewModel.findById(
      id,
      Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields,
      options?.queryOptions
    ) as unknown as DocumentType<ViewModel>
  }

  async getByCode(code: string, options?: ServiceGetOptions<ViewField>) {
    await this.checkExists({ code }, { error: new BadRequestException(VIEW_WITH_CODE_NOT_FOUND(code)) })

    return this.viewModel.findOne(
      { code },
      Array.isArray(options?.fields) ? fieldsArrayToProjection(options?.fields) : options?.fields,
      options?.queryOptions
    ) as unknown as DocumentType<ViewModel>
  }

  async getByUserId(userId: Types.ObjectId | MongoIdString, intrfc?: string, options?: ServiceGetOptions<ViewField>) {
    const user = await this.userService.getById(userId, {
      queryOptions: {
        populate: [
          { path: 'views', select: options?.fields, populate: { path: 'interface' } },
          { path: 'roles.role', populate: { path: 'views', select: options?.fields, populate: { path: 'interface' } } },
        ],
        projection: { views: 1, roles: 1 },
      },
    })

    let views = [
      ...user.roles
        .map(role => role.role)
        .map(role => {
          role = role as RoleModel
          return role.views
        })
        .flat()
        .filter(view =>
          user.views.find(v => {
            view = view as ViewModel
            v = v as ViewModel
            return v.id !== view.id
          })
        ),
      ...user.views,
    ]

    if (intrfc)
      views = views.filter(view => {
        view = view as ViewModel
        view.interface = view.interface as InterfaceModel
        return view.interface.code === intrfc
      })

    return views
  }

  async update(dto: UpdateViewDto) {
    await this.checkExists({ code: dto.code })
    await this.interfaceService.checkExists(
      { code: dto.interface },
      { error: new BadRequestException(INTERFACE_WITH_CODE_NOT_FOUND(dto.interface)) }
    )
    await this.viewModel.updateOne({ code: dto.code }, { $set: dto })
  }

  async delete(id: Types.ObjectId | MongoIdString) {
    await this.checkExists({ _id: id })
    await this.viewModel.deleteOne({ _id: id })
    await this.userService.clearFromId(id)
    await this.roleService.clearFromId(id)
    return
  }

  async checkExists(
    filter: ObjectByInterface<typeof ViewFieldsEnum, ModelBase> | ObjectByInterface<typeof ViewFieldsEnum, ModelBase>[],
    options?: { error?: ((filter: ObjectByInterface<typeof ViewFieldsEnum, ModelBase>) => Error) | Error; checkExisting?: boolean }
  ) {
    options = {
      error: f => new NotFoundException(VIEW_WITH_ID_NOT_FOUND(f._id)),
      checkExisting: true,
      ...options,
    }
    if (Array.isArray(filter)) {
      for await (const f of filter) {
        const candidate = await this.viewModel.exists(f)

        if (!candidate && options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        } else if (candidate && !options.checkExisting) {
          if (typeof options.error === 'function') throw options.error(f)
          throw options.error
        }
      }
    } else {
      const candidate = await this.viewModel.exists(filter)
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
