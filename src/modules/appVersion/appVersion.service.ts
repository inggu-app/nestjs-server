import { Injectable } from '@nestjs/common'
import { CheckExistenceService } from '../../global/classes/CheckExistenceService'
import { AppVersionModel } from './appVersion.model'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { AddAppVersionDto } from './dto/addAppVersion.dto'
import { APP_VERSION_FOR_OS_WITH_VERSION_EXISTS, APP_VERSION_FOR_OS_WITH_VERSION_NOT_FOUND } from '../../global/constants/errors.constants'
import { OperationSystem } from '../../global/enums/OS.enum'
import { QueryOptions } from 'mongoose'

@Injectable()
export class AppVersionService extends CheckExistenceService<AppVersionModel> {
  constructor(@InjectModel(AppVersionModel) private readonly appVersionModel: ModelType<AppVersionModel>) {
    super(appVersionModel, undefined, version => APP_VERSION_FOR_OS_WITH_VERSION_NOT_FOUND(version.os, version.version))
  }

  async create(dto: AddAppVersionDto) {
    await this.throwIfExists({ os: dto.os, version: dto.version }, { error: APP_VERSION_FOR_OS_WITH_VERSION_EXISTS(dto.os, dto.version) })
    return this.appVersionModel.create(dto)
  }

  async getFromVersion(os: OperationSystem, version: string, queryOptions?: QueryOptions) {
    await this.throwIfNotExists({ os, version })
    return this.appVersionModel.find({ os, version: { $gt: version } }, undefined, queryOptions)
  }

  async getVersion(os: OperationSystem, version: string, queryOptions?: QueryOptions) {
    await this.throwIfNotExists({ os, version })
    return this.appVersionModel.findOne({ os, version }, undefined, queryOptions)
  }

  async checkUpdate(os: OperationSystem, version: string) {
    await this.throwIfNotExists({ os, version })
    return this.appVersionModel.exists({ os, version: { $gt: version } })
  }

  async delete(os: OperationSystem, version: string) {
    await this.throwIfNotExists({ os, version })
    return this.appVersionModel.deleteOne({ os, version })
  }
}
