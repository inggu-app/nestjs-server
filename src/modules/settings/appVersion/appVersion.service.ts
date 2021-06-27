import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { AppVersionModel } from './appVersion.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateAppVersionDto } from './dto/createAppVersion.dto'
import { APP_VERSION_TYPE } from '../settings.constants'

@Injectable()
export class AppVersionService {
  constructor(
    @InjectModel(AppVersionModel) private readonly appVersionModel: ModelType<AppVersionModel>
  ) {}

  getActiveAppVersion() {
    return this.appVersionModel.findOne(
      { settingType: APP_VERSION_TYPE, isActive: true },
      { iosVersion: 1, androidVersion: 1, _id: 0 }
    )
  }

  createAppVersion(dto: CreateAppVersionDto) {
    return this.appVersionModel.create({
      iosVersion: dto.iosVersion,
      androidVersion: dto.androidVersion,
      settingType: APP_VERSION_TYPE,
    })
  }

  deleteActiveAppVersion() {
    return this.appVersionModel.deleteOne({ settingType: APP_VERSION_TYPE, isActive: true })
  }
}
